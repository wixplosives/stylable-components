import { sleep } from 'promise-assist';
import boards from '../board-index';
import type { ScenarioProps } from '../board-plugins';

const asyncWaitFor = async (cb: () => Promise<void>, timeoutMessage: string, timeout: number) => {
    let done = false;
    await Promise.race([cb().then(() => (done = true)), sleep(timeout)]);
    if (!done) {
        throw new Error(timeoutMessage);
    }
};

for (const sim of boards) {
    describe(sim.name, () => {
        for (const plg of sim.plugins || []) {
            if (plg.key.pluginName === 'scenario') {
                const props = plg.props as Required<ScenarioProps>;
                const itFn = props.skip ? xit : it;

                // increase timeout by 20% so that the waitFor timeouts before the test
                // and we'll get a better error message during a failure
                const timeout = props.events.reduce((acc, item) => acc + item.timeout, 0) * 1.2;
                itFn(props.title, async function () {
                    this.timeout(timeout);
                    const { canvas, cleanup: stageCleanup } = sim.setupStage();
                    const simCleanup = await sim.render(canvas);
                    await sleep(100);

                    for (const { execute, title, timeout } of props.events) {
                        try {
                            await asyncWaitFor(
                                async () => {
                                    await execute();
                                },
                                `${title} timed out`,
                                timeout
                            );
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : String(err);
                            throw new Error(`failed to run action ${title}
                                ${errMessage}`);
                        }
                    }
                    simCleanup();
                    stageCleanup();
                });
            }
        }
    });
}

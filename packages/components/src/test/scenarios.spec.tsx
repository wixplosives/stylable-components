import { waitFor } from 'promise-assist';
import UseScrollHorizontalSim from '../hooks/simulations/use-scroll/use-scroll-horizontal-window.board';
import UseScrollVerticallySim from '../hooks/simulations/use-scroll/use-scroll-vertical-window.board';
import UseScrollWithRef from '../hooks/simulations/use-scroll/use-scroll-with-ref.board';
import type { ScenarioProps } from '../simulation-mixins/scenario';

const simulations = [UseScrollHorizontalSim, UseScrollVerticallySim, UseScrollWithRef];
for (const sim of simulations) {
    describe(sim.name, () => {
        for (const plg of sim.plugins || []) {
            if (plg.key.pluginName === 'scenario') {
                const props = plg.props as Required<ScenarioProps>;
                const itFn = props.skip ? xit : it;
                const timeout = props.timeout ?? 2000;
                itFn(props.title, async () => {
                    const { canvas, cleanup: stageCleanup } = sim.setupStage();
                    const simCleanup = await sim.render(canvas);

                    for (const { execute, title } of props.events) {
                        try {
                            await waitFor(
                                async () => {
                                    await execute();
                                },
                                // decrease timeout by 10ms so that the waitFor timeouts before the test
                                // and we'll get a better error message during a failure
                                { timeout: timeout - 10 }
                            );
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : String(err);
                            throw new Error(`failed to run action ${title} 
                                ${errMessage}`);
                        }
                    }
                    simCleanup();
                    stageCleanup();
                }).timeout(timeout);
            }
        }
    });
}

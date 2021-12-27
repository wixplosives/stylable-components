import { waitFor } from 'promise-assist';
import UseScrollHorizontalSim from '../hooks/simulations/use-scroll/use-scroll-horizontal-window.demo';
import UseScrollVerticallySim from '../hooks/simulations/use-scroll/use-scroll-vertical-window.demo';
import UseScrollWithRef from '../hooks/simulations/use-scroll/use-scroll-with-ref.demo';
import type { ScenarioProps } from '../simulation-mixins/scenario';

const simulations = [UseScrollHorizontalSim, UseScrollVerticallySim, UseScrollWithRef];
for (const sim of simulations) {
    describe(sim.name, () => {
        for (const plg of sim.plugins || []) {
            if (plg.key.pluginName === 'scenario') {
                const props = plg.props as Required<ScenarioProps>;
                if (props.skip) {
                    xit(props.title);
                } else {
                    it(props.title, async function () {
                        this.timeout(props.timeout || 2000);
                        const { canvas, cleanup } = sim.setupStage();
                        await sim.render(canvas);

                        for (const { execute, title } of props.events) {
                            try {
                                await waitFor(async () => {
                                    await execute();
                                });
                            } catch (err) {
                                const errMessage = err instanceof Error ? err.message : '';
                                throw new Error(`failed to run action ${title} 
                                ${errMessage}`);
                            }
                        }
                        cleanup();
                    });
                }
            }
        }
    });
}

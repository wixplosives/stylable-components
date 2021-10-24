import UseScrollHorizontalSim from '../hooks/simulations/use-scroll/use-scroll-horizontal-window.sim';
import UseScrollVerticallSim from '../hooks/simulations/use-scroll/use-scroll-vertical-window.sim';
import UseScrollWithRef from '../hooks/simulations/use-scroll/use-scroll-with-ref.sim';
import type { ScenarioProps } from '../simulation-mixins/scenario';

const sims = [UseScrollHorizontalSim, UseScrollVerticallSim, UseScrollWithRef];

for (const sim of sims) {
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
                        for (const action of props.events) {
                            try {
                                await action.execute();
                            } catch (err) {
                                const errMessage = err instanceof Error ? err.message : '';
                                throw new Error(`failed to run action ${action.title} 
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

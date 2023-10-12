import { setSeederFactory } from 'typeorm-extension';
import { Step } from '../../entities/Step'
export default setSeederFactory(Step, (faker) => {
    const step = new Step();
    step.name = faker.company.buzzNoun();
    step.hint = faker.company.buzzNoun();
    step.location = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude()
    };
    return step;
})

import faker from '@faker-js/faker';
import { User } from '../../components/user/user.model';

const userOne = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const userTwo = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const insertUsers = async (users) => {
  await User.query().insert(users.map((user: any) => user));
};

export { userOne, userTwo, insertUsers };

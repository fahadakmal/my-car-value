import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;
  const users: User[] = [{ id: 1, email: 'fahad@gmail.com', password: 'asad' }];

  beforeEach(async () => {
    fakeAuthService = {
      // signUp: (createUserDto) => Promise.resolve({} as User),
      // signIn: () => {},
    };
    fakeUserService = {
      findOne: (id: number) => {
        const user = users.find((user) => user.id === Number(id));
        return Promise.resolve(user);
      },
      // remove: () => {},
      // update: () => {},
      find: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users with given emil', async () => {
    const users = await controller.findAllUser('fahad@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('fahad@gmail.com');
  });

  it('find  user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user.email).toEqual('fahad@gmail.com');
  });

  it('throw if find  user with given not id', async () => {
    const user = await controller.findUser('2');
    expect(user).toBeUndefined();
  });
});

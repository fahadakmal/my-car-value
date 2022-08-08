import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];
  let fakeUserRepositery: Partial<UserService>;
  beforeEach(async () => {
    fakeUserRepositery = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        };
        users.push(user as User);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserRepositery,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp({
      email: 'faad@gmail.com',
      password: 'asdf',
    });
    expect(user.password).not.toEqual('asdf');
  });

  it('throws an error if email already in use', async () => {
    await service.signUp({ email: 'asdf@asdf.com', password: 'asdf' }),
      await expect(
        service.signUp({ email: 'asdf@asdf.com', password: 'asdf' }),
      ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signIn('ali@gmail.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if signin with invalid password', async () => {
    await service.signUp({ email: 'asa@gmail.com', password: 'asdf' });
    await expect(service.signIn('asa@gmail.com', 'ccfcfcf')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('return a user if password i s correct', async () => {
    await service.signUp({ email: 'asad@gmail.com', password: 'asdf' });
    const user = await service.signIn('asad@gmail.com', 'asdf');
    expect(user).toBeDefined();
  });
});

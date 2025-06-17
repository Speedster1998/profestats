import users from '../data/Usuarios.json';

export const UserService = {
  login: (email, password) => {
    const matchingUser = users.find(
      user => user.email === email && user.password === password
    );

    return matchingUser;
  },

  loadUsersFromJson: () => {
    return users;
  }
};

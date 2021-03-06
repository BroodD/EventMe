export class CardMongo {
  constructor(title, desc, user, time, people, location) {
    this.title = title;
    this.desc = desc;
    this.user = user;
    this.time = time;
    this.people = people;
    this.location = location;
  }
}

export class User {
  constructor(
    _id = null,
    login = null,
    name = null,
    img = null,
    bio = null,
    email = null
  ) {
    this._id = _id;
    this.login = login;
    this.name = name;
    this.img = img;
    this.bio = bio;
    this.email = email;
  }
}

export class UserMongo {
  constructor(login = "", name = "", img = "", bio = "", email = null) {
    this.login = login;
    this.name = name;
    this.img = img;
    this.bio = bio;
    this.email = email;
  }
}

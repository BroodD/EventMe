export
class Cards {
	constructor(title, desc, ownerId, time, like, visit, people, comments, ownerName = null, ownerImg = null, img = null, id = null) {
		this.title = title
		this.desc = desc
		this.ownerId = ownerId
		this.time = time
		this.like = like
		this.visit = visit
		this.people = people
		this.comments = comments
		this.ownerName = ownerName
		this.ownerImg = ownerImg
		this.img = img
		this.id = id
	}
}

export
class CardMongo {
  constructor(title, desc, user, time,  people, comments, create, img = null) {
    this.title = title
    this.desc = desc
    this.user = user
    this.time = time
    this.people = people
    this.comments = comments
    this.create = create
    this.img = img || []
  }
}

export
class User {
	constructor(_id = null, login = null, name = null, img = null, bio = null, email = null) {
    this._id = _id
		this.login = login
		this.name = name
		this.img = img
		this.bio = bio
		this.email = email
	}
}

export
class UserMongo {
  constructor(login = '', name = '', img = '', bio = '', email = null) {
    this.login = login
    this.name = name
    this.img = img
    this.bio = bio
    this.email = email
  }
}
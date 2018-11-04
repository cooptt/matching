
create table  User (
userId int not null,
loginServiceId varchar(45),
firstName varchar(45),
lastName varchar(45),
email varchar(60),
country varchar(45),
city varchar(45),
rating float,
primary key (userId)
);


create table VideoGame (
videoGameId int not null,
title varchar(45),
image varchar(80),
primary key (videoGameId)
);

create table Offer(
offerId int not null,
userId int not null,
videoGameId int not null,
type tinyint,
price float,
primary key(offerId),
foreign key(videoGameId) references VideoGame(videoGameId) on update cascade on delete cascade,
foreign key (userId) references User(userId) on update cascade on delete cascade
);

create table Message(
srcUserId int not null,
destUserId int not null,
dateMillis bigint not null,
content varchar(256),
primary key(srcUserId, destUserId, dateMillis),
foreign key(srcUserId) references User(userId) on update cascade on delete cascade,
foreign key(destUserId) references User(userId) on update cascade on delete cascade
);


create table Rating(
ratingUserId int not null,
ratedUserId int not null,
rating int,
primary key(ratingUserId, ratedUserId),
foreign key(ratingUserId) references User(userId) on update cascade on delete cascade,
foreign key(ratedUserId) references User(userId) on update cascade on delete cascade
);
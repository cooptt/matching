
create table  User (
userId int not null,
loginServiceId int not null,
firstName varchar(45),
lastName varchar(45),
email varchar(60),
country varchar(45),
city varchar(45),
punctuation float,
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
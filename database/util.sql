

drop database analizer;
create database analizer;
use analizer;



select * from  Message
where userId=srcUserId
or userId=destUserId;


insert into Message
set srcUserId=0, destUserId=1,
dateMillis=123456, content='Primer Mensaje';


delete from Message; delete from Offer; delete from User; delete from VideoGame;

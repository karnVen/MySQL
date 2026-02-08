use url_shortener_mysql;
create table short_links(
id int auto_increment primary key,
short_code varchar(20) not null unique,
url varchar(225) not null 
);

select * from short_links;
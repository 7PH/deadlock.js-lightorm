FROM mysql:5

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE testdb
ENV MYSQL_USER mysql
ENV MYSQL_PASSWORD mysql

ADD setup.sql /docker-entrypoint-initdb.d

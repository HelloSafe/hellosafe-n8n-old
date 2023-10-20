FROM n8nio/n8n:latest

USER root

WORKDIR /home/node/packages/cli
ENTRYPOINT []

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENV DB_POSTGRESDB_SSL_CA=/home/node/rds-ca-2019-root.pem
ENV DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false
ADD https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem /home/node/
CMD ["/entrypoint.sh"]
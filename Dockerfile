FROM nginx
MAINTAINER Ambar "http://ambar.cloud"

# Set a timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY default /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

CMD echo $api > /usr/share/nginx/html/apiUrl.txt && nginx -g "daemon off;"

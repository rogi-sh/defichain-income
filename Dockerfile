FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist/defichain-income /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

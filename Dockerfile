FROM quay.io/gurusensei/gurubhay:latest

RUN git clone https://github.com/PRINCETECH20/Prince-bot-md /root/prince

WORKDIR /root/prince/

RUN npm install --platform=linuxmusl

EXPOSE 5000

CMD ["npm", "start"]

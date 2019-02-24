npm install;
ng add @angular/material;
npm install --save angular-bootstrap-md;
npm install --save chart.js@2.5.0 @types/chart.js @types/chart.js @fortawesome/fontawesome-free hammerjs;
npm install --save express;
npm install --save-dev nodemon;
npm install --save body-parser;
npm install --save mongoose;
npm install --save multer;
npm install --save mongoose-unique-validator;
npm install --save bcryptjs
npm install --save jsonwebtoken;
npm install --save https;
npm install --save fs;

#CREATE SSL KEYS
#openssl genrsa -out privatekey.pem 1024
#openssl req -new -key privatekey.pem -out certrequest.csr
#openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

#DEPLOY IN FIREBASE
#ng build --prod
#sudo npm install -g firebase-tools
#firebase login
#firebase use -add //only if project has not been added yet
#firebase init
#firebase deploy
#firebase open hosting:site

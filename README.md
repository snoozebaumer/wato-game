# wato-game
Game microservice for ["What are the Odds"](https://github.com/snoozebaumer/wato).

See the gateway [wato-gateway](https://github.com/snoozebaumer/wato-gateway) for complete system setup information.

## Project setup
1. Run the following command to install all dependencies:
```
npm install
```
2. Set up a mongoDB (either local or online) and remember connection string, as well as user / password.
3. Copy the `.env.example` file and rename it to `.env`. Then fill in the required db environment variables.

## Run the project
Run the following command to start the server:
```
npm run start
```

## API Documentation

| #   | Endpoint                                               | Method | Description                                                | Request Body                                                           | Response Body                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------ | ------ | ---------------------------------------------------------- | ----------------------------------------------------------------------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | `/game`                                                | POST   | Create Challenge                                           | `challenge` (object, required): Challenge object with necessary properties | `id` (string)                                                                                                                                                                                                                                          |
| 2   | `/game/:id`<br>param: `id`(string, required)           | GET    | Get Challenge by ID                                        | -                                                                     | `id` (string)<br>`challengerId` (string)<br>`challenge` (string)<br>`challengeeId` (string, optional)<br>`challengeStatus` (string)<br>`maxRange` (number, optional)<br>`challengeeNumber` (number, optional)<br>`challengerNumber` (number, optional) |
| 3   | `/game/:id`<br>param: `id`(string, required)           | PUT    | Set Game number range for challenge by ID<br>**Prerequisite:**<br> challengeStatus: NEW | `maxRange` (number, required)<br>`challengeeName` (string, required)                                         | `id` (string)<br>`challengerId` (string)<br>`challenge` (string)<br>`challengeeId` (string)<br>`challengeStatus` (string)<br>`maxRange` (number)                                                                                                       |
| 4   | `/game/:id`<br>param: `id`(string, required)           | PUT    | Update Challenge by ID<br>**Prerequisite:**<br> challengeStatus: GUESS_TO_BE_SET | `challengeeNumber` (number, required) | `id` (string)<br>`challengerId` (string)<br>`challenge` (string)<br>`challengeeId` (string)<br>`challengeStatus` (string)<br>`maxRange` (number)<br>`challengeeNumber` (number)                                                                        |
| 5   | `/game/:id`<br>param: `id`(string, required)           | PUT    | Update Challenge by ID<br>**Prerequisite:**<br> challengeStatus: CHALLENGER_TO_MOVE | `challengerNumber` (number, required)                                 | `id` (string)<br>`challengerId` (string)<br>`challenge` (string)<br>`challengeeId` (string)<br>`challengeStatus` (string)<br>`maxRange` (number)<br>`challengeeNumber` (number)<br>`challengerNumber` (number)                                         |


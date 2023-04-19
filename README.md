# `event-sourcing-serverless-demo`

* Author: Dr. Bertrand Caron (CTO & co-founder, Bloom Impact Investing)
* Date: 19/04/2023

## Purpose

The aim of this project is to demonstrate some aspects of the event sourcing pattern on a simple Serverless (AWS) REST API.
You can step through the commits to see how the project is built (every commit should be deployable).
Note that not all endpoints are available in all commits!

## How to use

### How to read these instructions

* The following examples are using a `zsh` shell.
* Lines starting with `$` represent prompts, and lines without it represents `stdout`.
* Do not include the `$` in your prompts.

### Instructions

* Provide your own AWS credentials:

```
export AWS_DEFAULT_REGION="ap-southeast-2"
export AWS_ACCESS_KEY_ID="${YOUR_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${YOUR_SECRET_ACCESS_KEY}"
```

* (If not already installed) Install `serverless` and `yarn` (requires `npm`):

```
npm -g serverless yarn
```

* Deploy the CloudFormation stack:

```
yarn deploy
```

* Extract your API endpoint from the previous command output (e.g. `https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users`)

* Create a new user:

```
$ curl -X POST https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users
{"data":{"eventType":"user.create","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a","createdAt":"2023-04-19T07:10:48.839Z"}}
```

* Use the returned `userId` to `GET` the user:

```
$ curl -X GET https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a
{"data":{"userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"}}
```

* Set the name of the user:

```
$ curl -X PUT -d '{"name": "Anakin Skywalker"}' https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a
{"data":{"eventType":"name.upsert","name":"Anakin Skywalker","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a","createdAt":"2023-04-19T07:14:09.798Z"}}
```

* Use the returned `userId` to `GET` the user:

```
$ curl -X GET https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a
{"data":{"name":"Anakin Skywalker","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"}}
```

* Update the name of the user:

```
$ curl -X PUT -d '{"name": "Darth Vader"}' https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a
{"data":{"eventType":"name.upsert","name":"Darth Vader","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a","createdAt":"2023-04-19T07:15:20.740Z"}}
```

* Use the returned `userId` to `GET` the user:

```
$ curl -X GET https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a
{"data":{"name":"Darth Vader","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"}}
```

* List all events for the user:

```
$curl -X GET https://iow82vxfsb.execute-api.ap-southeast-2.amazonaws.com/dev/users/f1e025e4-de8c-498b-a2c4-2c45f91e302a/events
{"data":[{"createdAt":"2023-04-19T07:10:48.839Z","eventType":"user.create","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"},{"createdAt":"2023-04-19T07:14:09.798Z","eventType":"name.upsert","name":"Anakin Skywalker","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"},{"createdAt":"2023-04-19T07:15:20.740Z","eventType":"name.upsert","name":"Darth Vader","userId":"f1e025e4-de8c-498b-a2c4-2c45f91e302a"}]}
```

# mini_todo_list_BE

[항해99 파트타임 1기][Chapter 4] 주특기 프로젝트

```
# express, sequelize, mysql2 라이브러리를 설치합니다.
npm install express sequelize mysql2

# sequelize-cli, nodemon 라이브러리를 DevDependency로 설치합니다.
npm install -D sequelize-cli nodemon

# 설치한 sequelize를 초기화 하여, sequelize를 사용할 수 있는 구조를 생성합니다.
npx sequelize init
```

```
npm install cors
```

```
내 프로젝트 폴더 이름
├── models
│   └── index.js
├── config
│   └── config.json
├── migrations
├── seeders
├── package-lock.json
└── package.json
```

API 실행 전, config.json 에서 아래처럼 "define" 추가하시기 바랍니다.

"development": {
.
.
.
"define": {
"timestamps": false
}
},

```
// config/config.json
{
  "development": {
    "username": "root",
    "password": "4321aaaa",
    "database": "express_sequelize_init",
    "host": "express-database.clx5r59t.ap-northeast-2.rds.amazonaws.com",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    }
  },
  "test": {
    // ...
  },
  "production": {
    // ...
  }
}
```

```
npx sequelize db:create
```

```
npx sequelize model:generate --name Users --attributes userId:INTEGER,email:string,password:string,nickname:string,age:INTEGER
npx sequelize model:generate --name Todos --attributes todoId:INTEGER,userId:INTEGER,title:string,content:string,createdAt:date,updateAt:date,doneAt:date,done:boolean
```

```
npx sequelize db:migrate
```

# Todo List RESTful API 서비스 (todosvc2)

이 프로젝트는 Node.js, Express, MongoDB, Mongoose, JWT(JSON Web Token) 인증을 사용하여 구현된 Todo List RESTful API 서비스입니다.

## 주요 기능

- 사용자 계정 생성 및 로그인 (JWT 토큰 기반 인증)
- 사용자별 Todo(할일) 목록 관리
  - Todo 항목 생성, 조회, 수정, 삭제
  - Todo 완료 상태 토글
- 입력 데이터 유효성 검사 및 보안 처리 (HMAC, Sanitization)
- API 요청 속도 제한 (Rate Limiting)
- MongoDB 데이터베이스 연동

## 기술 스택

- **런타임:** Node.js (버전 22 이상)
- **프레임워크:** Express.js
- **데이터베이스:** MongoDB (Mongoose ODM)
- **인증:** JWT (JSON Web Token)
- **개발 도구:** Babel (ES6+ 트랜스파일링), ESLint, Prettier, Nodemon
- **기타:** CORS, Morgan (로깅)

## API 엔드포인트

### 인증

- `POST /users/create`: 사용자 계정 생성
- `POST /login`: 로그인 및 JWT 토큰 발급

### Todo 관리

- `GET /todolist`: 사용자의 모든 Todo 목록 조회
- `GET /todolist/:id`: 특정 Todo 항목 조회
- `POST /todolist`: 새로운 Todo 항목 생성
- `PUT /todolist/:id`: 특정 Todo 항목 수정
- `DELETE /todolist/:id`: 특정 Todo 항목 삭제
- `PUT /todolist/:id/done`: 특정 Todo 항목의 완료 상태 토글

> `_long` 접미사가 붙은 엔드포인트들은 의도적으로 지연(1초)이 추가된 버전으로, 로딩 상태 등을 테스트하기 위해 사용됩니다. (예: `GET /todolist_long`)

### UI 페이지

- `GET /`: 서비스 소개 페이지

## 설치 및 실행 방법

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run start:dev
   ```
   - `nodemon`을 사용하여 코드 변경 시 자동으로 서버를 재시작합니다.

3. **배포용 빌드**
   ```bash
   npm run build
   ```
   - ES6+ 코드를 `dist` 디렉토리에 트랜스파일링합니다.

4. **배포 서버 실행**
   ```bash
   npm start
   ```
   - 빌드된 코드를 실행합니다.

## 환경 변수

서비스는 다음과 같은 환경 변수를 사용합니다. `.env` 파일을 생성하여 설정할 수 있습니다.

- `PORT`: 서버 포트 (기본값: 3000)
- `MONGODB_URI`: MongoDB 연결 URI (기본값: mongodb://localhost:27017/tododb)
- `JWT_SECRET_KEY`: JWT 토큰 서명에 사용되는 비밀 키 (생산 환경에서는 반드시 설정 필요)
- `PASSWORD_SALT`: 비밀번호 해싱에 사용되는 솔트 값

## 보안

- JWT 토큰을 사용한 API 인증
- HMAC을 사용한 비밀번호 해싱
- 입력 데이터 Sanitization (XSS 방지)
- API 요청 속도 제한

## 개발 스크립트

- `npm run lint`: ESLint를 사용하여 코드 문법 검사
- `npm run format`: Prettier를 사용하여 코드 포맷팅

## 라이선스

ISC
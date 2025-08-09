# TodoSvc2 📝

**Node.js**, **Express**, **MongoDB**, **JWT 인증**을 사용한 모던 할일 목록 RESTful API 서비스입니다.

## 🚀 주요 기능

- **RESTful API**: 할일 관리를 위한 완전한 CRUD 작업
- **JWT 인증**: 안전한 토큰 기반 인증 시스템
- **사용자 관리**: 사용자 등록 및 로그인 시스템
- **입력 검증**: 포괄적인 데이터 검증 및 정화
- **속도 제한**: 무차별 대입 공격 방지
- **보안 강화**: 최신 보안 관행 적용
- **자동 데이터 만료**: 테스트 데이터 14일 후 자동 삭제
- **ES 모듈**: 최신 JavaScript ES 모듈 지원

## 🛠 기술 스택

- **백엔드**: Node.js 22+, Express 4.19+
- **데이터베이스**: MongoDB with Mongoose ODM
- **인증**: JWT (JSON Web Tokens)
- **보안**: 입력 검증, 속도 제한, CORS
- **개발 도구**: Babel, Nodemon, ESLint, Prettier

## 📋 사전 요구사항

- **Node.js** >= 22.0.0
- **MongoDB** localhost:27017에서 실행 중 (또는 설정된 URI)
- **npm** >= 8.0.0

## ⚙️ 설치 및 설정

### 1. 복제 및 의존성 설치
```bash
git clone <repository-url>
cd todosvc2
npm install
```

### 2. MongoDB 설정
MongoDB 서버를 시작하세요:
```bash
# MongoDB 시작 예시
./bin/mongod --dbpath data/db --port 27017
```

### 3. 환경 설정
예제 환경 파일을 복사하고 설정하세요:
```bash
cp .env.example .env
```

`.env` 파일을 설정값으로 편집하세요:
```env
JWT_SECRET_KEY=최소_32자_이상의_안전한_jwt_비밀키를_여기에_입력하세요
PASSWORD_SALT=프로덕션에서_변경할_비밀번호_솔트를_여기에_입력하세요
MONGODB_URI=mongodb://localhost:27017/tododb
NODE_ENV=development
PORT=3000
```

### 4. 애플리케이션 실행

**개발 모드:**
```bash
npm run start:dev
```

**운영 모드:**
```bash
npm run build
npm start
```

## 🌐 API 사용법

### 기본 URL
- **개발**: `http://localhost:3000`
- **운영**: `https://todosvc2.herokuapp.com`

### API 문서
모든 엔드포인트에 대한 예제가 포함된 대화형 API 문서는 `http://localhost:3000`에서 확인하세요.

## 📚 API 엔드포인트

### 🔐 인증
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| POST | `/users/create` | 새 사용자 계정 생성 |
| POST | `/login` | 사용자 로그인 및 JWT 토큰 발급 |

### 📝 할일 관리 (JWT 인증 필요)
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/todolist` | 사용자 할일 목록 조회 |
| GET | `/todolist/:id` | 특정 할일 항목 조회 |
| POST | `/todolist` | 새 할일 생성 |
| PUT | `/todolist/:id` | 할일 항목 수정 |
| DELETE | `/todolist/:id` | 할일 항목 삭제 |
| PUT | `/todolist/:id/done` | 할일 완료 상태 토글 |

### ⏱️ 지연 응답 엔드포인트
테스트를 위해 1초 지연된 응답을 받으려면 엔드포인트에 `_long`을 추가하세요:
- `/todolist_long`, `/todolist_long/:id` 등

## 🛡️ 보안 기능

- **JWT 비밀키**: 개발용 안전한 무작위 키 생성
- **비밀번호 해싱**: 솔트가 추가된 SHA-256 해싱
- **입력 검증**: 이메일, 비밀번호, 내용 검증
- **속도 제한**: 
  - 인증: 15분당 10회 요청
  - API: 15분당 100회 요청
- **데이터 정화**: 입력 정화를 통한 XSS 보호
- **오류 처리**: 정보 유출 없는 안전한 오류 응답

## 📊 개발 도구

```bash
# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format

# 운영용 빌드
npm run build
```

## 🔧 설정

### 환경 변수
| 변수 | 설명 | 기본값 |
|------|------|--------|
| `JWT_SECRET_KEY` | JWT 서명 비밀키 (운영 환경에서 필수) | 개발 환경에서 생성 |
| `PASSWORD_SALT` | 비밀번호 해싱 솔트 | 기본 솔트 |
| `MONGODB_URI` | MongoDB 연결 문자열 | `mongodb://localhost:27017/tododb` |
| `NODE_ENV` | 환경 모드 | `development` |
| `PORT` | 서버 포트 | `3000` |

### 데이터베이스 스키마

**Users 컬렉션:**
```javascript
{
  _id: String,      // 이메일 주소
  username: String, // 표시 이름
  role: String,     // 사용자 역할
  password: String, // 해시된 비밀번호
  created: Date     // 14일 후 자동 만료
}
```

**TodoLists 컬렉션:**
```javascript
{
  _id: String,      // 고유 ID
  users_id: String, // 사용자 이메일
  todo: String,     // 할일 제목 (1-200자)
  desc: String,     // 설명 (최대 1000자)
  done: Boolean,    // 완료 상태
  created: Date     // 14일 후 자동 만료
}
```

## 📝 사용 예제

### 사용자 생성
```bash
curl -X POST http://localhost:3000/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user@example.com",
    "username": "홍길동",
    "password": "안전한비밀번호123"
  }'
```

### 로그인
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user@example.com",
    "password": "안전한비밀번호123"
  }'
```

### 할일 목록 조회 (JWT 포함)
```bash
curl -X GET http://localhost:3000/todolist \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 중요 사항

- **테스트 환경**: 모든 데이터는 14일 후 자동으로 만료됩니다
- **운영 보안**: `JWT_SECRET_KEY`와 `PASSWORD_SALT` 환경 변수를 설정하세요
- **CORS 활성화**: 프론트엔드 통합을 위해 교차 출처 요청이 허용됩니다
- **최신 Node.js**: 최적의 성능을 위해 Node.js 22+ 필요

## 🔄 최근 업데이트

- ✅ 모든 의존성을 최신 버전으로 업데이트
- ✅ 포괄적인 검증으로 보안 강화
- ✅ 속도 제한 및 입력 정화 추가
- ✅ ES 모듈로 마이그레이션
- ✅ 오류 처리 및 로깅 개선
- ✅ 개발 도구 추가 (ESLint, Prettier)

## 📄 라이선스

ISC 라이선스

## 🤝 기여하기

1. 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/놀라운기능`)
3. 변경사항을 커밋하세요 (`git commit -m '놀라운 기능 추가'`)
4. 브랜치에 푸시하세요 (`git push origin feature/놀라운기능`)
5. 풀 리퀘스트를 여세요

---

**학습과 시연 목적으로 ❤️를 담아 제작되었습니다**



# Auth API Endpoints (для фронтенда)

## 1. Регистрация пользователя
**POST** `/auth/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "is_active": true,
    "is_verified": false
  }
  ```

---

## 2. Логин пользователя
**POST** `/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "<JWT>",
    "token_type": "bearer"
  }
  ```

---

## 3. Подтверждение email
**POST** `/auth/verify-email`
- **Request Body:**
  ```json
  {
    "token": "123456"
  }
  ```
- **Response:**
  ```json
  { "message": "Email verified" }
  ```

---

## 4. Повторная отправка письма для подтверждения email
**POST** `/auth/resend-verification`
- **Request Body:**
  ```json
  { "email": "user@example.com" }
  ```
- **Response:**
  ```json
  { "message": "Verification email resent" }
  ```

---

## 5. Запрос на сброс пароля
**POST** `/auth/forgot-password`
- **Request Body:**
  ```json
  { "email": "user@example.com" }
  ```
- **Response:**
  ```json
  { "message": "Password reset email sent" }
  ```

---

## 6. Сброс пароля по токену
**POST** `/auth/reset-password`
- **Request Body:**
  ```json
  {
    "token": "<reset_token>",
    "new_password": "newpassword"
  }
  ```
- **Response:**
  ```json
  { "message": "Password reset successful" }
  ```

---

## Примечания
- Все ответы и ошибки приходят в формате JSON.
- Для защищённых эндпоинтов используйте `access_token` из логина в заголовке:
  ```
  Authorization: Bearer <access_token>
  ```
- Для email-подтверждения и сброса пароля токены выводятся в консоль (или отправляются на email, если настроить SMTP). 
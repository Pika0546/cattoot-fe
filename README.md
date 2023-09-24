# About the project

## Package used:

1. Main framework: `ReactJS`
2. UI: `Material UI`
3. Form: `react-hook-form`
4. Router: `react-router-dom`
5. Handle query string: `query-string`

# How to run project locally

1. Create a .env.local file and copy content of .env.example to it.
1. Run `npm install`
1. Run `npm start`
1. Project will start add `localhost:3000`

# Cách dùng component LoggedPageWrapper

Trong TRANG nào mà cần đăng nhập để vào thì bọc trang đó bằng component LoggedPageWrapper như cách đã làm trong file App.js

```js
<Route exact path='/group/create' element={(
    <LoggedPageWrapper>
        <GroupCreatePage></GroupCreatePage>
    </LoggedPageWrapper>
)}>
```

Sau đó, bên trong component GroupCreatePage hoặc mọi component nằm trong GroupCreatePage đều có thể lấy thông tin user ra bằng cách: (xem ví dụ trong component CreateGroupForm)

```js
const { user } = useContext(AppContext);
```

# Cách dùng useToast

Trong component nào mà muốn sử dụng toast noti thì use cái hook sau:

```js
const toast = useToast();
```

và sau đó muốn noti gì thì cứ dùng:

```js
//noti xanh dương (info)
toast.info("hello");

//noti xanh lục (success)
toast.success("hello");

//noti cam (warning)
toast.warning("hello");

//noti đỏ (error)
toast.error("hello");

//noti xám (normal)
toast.normal("hello");
```

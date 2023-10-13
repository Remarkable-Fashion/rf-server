// import admin from 'firebase-admin';

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
// });

// const link = 'https://yourapp.page.link'; // 여기에 Dynamic Link의 접두사를 넣으세요.
// const params = {
//   link: 'https://example.com/your-page', // 사용자를 보낼 링크를 넣으세요.
//   domainUriPrefix: link,
//   androidInfo: {
//     androidPackageName: 'com.example.yourapp'
//   },
//   // iOS 앱에 대한 정보도 여기에 추가할 수 있습니다.
// };

// // Dynamic Link를 생성하는 함수
// async function createDynamicLink() {
//   const result = await admin.dynamicLinks().createShortDynamicLink(params);
//   console.log('Dynamic Link:', result);
// }

// createDynamicLink();

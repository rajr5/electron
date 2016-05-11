# 개요

> Node.js와 Electron API를 사용하는 방법.

Electron은 모든 [Node.js의 built-in 모듈](http://nodejs.org/api/)과 third-party
node 모듈을 완벽하게 지원합니다. ([네이티브 모듈](../tutorial/using-native-node-modules.md)
포함)

또한 Electron은 네이티브 데스크톱 어플리케이션을 개발 할 수 있도록 추가적인 built-in
모듈을 제공합니다. 몇몇 모듈은 메인 프로세스에서만 사용할 수 있고 어떤 모듈은 렌더러
프로세스(웹 페이지)에서만 사용할 수 있습니다. 또한 두 프로세스 모두 사용할 수 있는
모듈도 있습니다.

기본적인 규칙으로 [GUI][gui]와 저 수준 시스템에 관련된 모듈들은 오직 메인
프로세스에서만 사용할 수 있습니다. [메인 프로세스 vs. 렌더러 프로세스](../tutorial/quick-start.md#메인-프로세스)
컨셉에 익숙해야 모듈을 다루기 쉬우므로 관련 문서를 읽어 보는 것을 권장합니다.

메인 프로세스 스크립트는 일반 Node.js 스크립트와 비슷합니다:

```javascript
const {app, BrowserWindow} = require('electron');

let win = null;

app.on('ready', () => {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL('https://github.com');
});
```

렌더러 프로세스도 예외적인 node module들을 사용할 수 있다는 점을 제외하면 일반 웹
페이지와 크게 다를게 없습니다:

```html
<!DOCTYPE html>
<html>
<body>
<script>
  const {app} = require('electron').remote;
  console.log(app.getVersion());
</script>
</body>
</html>
```

어플리케이션을 실행하려면 [앱 실행하기](../tutorial/quick-start.md#앱 실행하기)
문서를 참고하기 바랍니다.

## 분리 할당

0.37 버전부터, [분리 할당][destructuring-assignment]을 통해 빌트인 모듈을 더
직관적으로 사용할 수 있습니다:

```javascript
const {app, BrowserWindow} = require('electron');
```

모든 `electron` 모듈이 필요하다면, 먼저 require한 후 각 독립적인 모듈을
`electron`에서 분리 할당함으로써 모듈을 사용할 수 있습니다.

```javascript
const electron = require('electron');
const {app, BrowserWindow} = electron;
 ```

위 코드는 다음과 같습니다:

```javascript
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
```

## 이전 스타일의 빌트인 모듈 비활성화

v0.35.0 이전 버전에선 빌트인 모듈이 모두 `require('module-name')`같은 형식으로
사용되었습니다. 하지만 [많은 단점][issue-387]이 있기 때문에 현재 API가 변경되었습니다.
하지만 오래된 앱의 호환성 유지를 위해 아직 구 버전 API를 지원하고 있습니다.

완벽하게 모든 구 버전 API를 비활성화하려면 `ELECTRON_HIDE_INTERNAL_MODULES` 환경
변수를 설정하면 됩니다:

```javascript
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true'
```

또는 `hideInternalModules` API를 사용해도 됩니다:

```javascript
require('electron').hideInternalModules();
```

[gui]: https://en.wikipedia.org/wiki/Graphical_user_interface
[destructuring-assignment]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[issue-387]: https://github.com/electron/electron/issues/387

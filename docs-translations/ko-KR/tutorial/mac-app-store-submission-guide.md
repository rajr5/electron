# Mac �� ����� ���ø����̼� ���� ���̵�

Electron�� v0.34.0 �������� �� ��Ű���� Mac App Store(MAS)�� ������ �� �ְ� �Ǿ����ϴ�.
�� ���̵�� ���ø����̼��� �� ���� ����ϴ� ����� ������ �Ѱ迡 ���� ������ �����մϴ�.

## �� ���� ���ø����̼��� ����ϴ� ���

���� �� ���� ������ ������ ���� �� ���� ���ø����̼��� ����ϴ� ����� �˾ƺ��ϴ�.
�Ѱ���, �� ������ ������ ���� Apple�κ��� ���εȴٴ� ���� Ȯ������ �ʽ��ϴ�.
���� ������ Apple�� [Submitting Your App][submitting-your-app] ���̵带 �����ϰ� �־�� �ϸ�
�� ����� ���� �䱸 ������ Ȯ���� �����ϰ� �־���մϴ�.

### ������ ���

�� ���� ���ø����̼��� �����Ϸ���, ���� Apple�κ��� �������� ����ؾ� �մϴ�.
��� ����� ������ ã�ƺ� �� �ִ� [���̵�][nwjs-guide]�� �����ϸ� �˴ϴ�.

### �ۿ� �����ϱ�

Apple�κ��� �������� ����ߴٸ�, [���ø����̼� ����](application-distribution.md) ������ ���� ���ø����̼��� ��Ű¡�մϴ�.
�׸��� ���ø����̼ǿ� ������ �մϴ�. �� ������ �⺻������ �ٸ� ���α׷��� �����ϴ�.
������ Ű�� Electron ���Ӽ� ���Ͽ� ���� ���� ���� �ؾ� �մϴ�.

ù��°, ���� �� �ڰ�(plist) ������ �غ��մϴ�.

`child.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.inherit</key>
    <true/>
  </dict>
</plist>
```

`parent.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
  </dict>
</plist>
```

�׸��� ���� ��ũ��Ʈ�� ���� ���ø����̼ǿ� �����մϴ�:

```bash
#!/bin/bash

# ���ø����̼��� �̸�
APP="YourApp"
# ������ ���ø����̼��� ���
APP_PATH="/path/to/YouApp.app"
# ���ε� ��Ű���� ��� ���
RESULT_PATH="~/Desktop/$APP.pkg"
# ��û�� �������� �̸�
APP_KEY="3rd Party Mac Developer Application: Company Name (APPIDENTITY)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Company Name (APPIDENTITY)"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Libraries/libnode.dylib"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Electron Framework"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign  -fs "$APP_KEY" --entitlements parent.plist "$APP_PATH"
productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
```

���� OS X�� ����ڽ� ���信 ���� ó�� ���Ѵٸ� Apple�� [Enabling App Sandbox][enable-app-sandbox] ������
�����Ͽ� �⺻���� ������ �����ؾ� �մϴ�. �׸��� �ڰ�(plist) ���Ͽ� ���ø����̼ǿ��� �䱸�ϴ� ������ Ű�� �߰��մϴ�.

### ���ø����̼��� ���ε��ϰ� ����� ������ ����

���ø����̼� ������ �Ϸ��� �� iTunes Connect�� ���ε��ϱ� ���� Application Loader�� ����� �� �ֽ��ϴ�.
����� ���ε��ϱ� ���� [���ڵ�][create-record]�� ��������� Ȯ���ؾ� �մϴ�.
�׸��� [����� ���� ����][submit-for-review]�� �� �ֽ��ϴ�.

## MAS ������ �Ѱ�

��� ���ø����̼� ����ڽ��� ���� �䱸 ������ ������Ű�� ����, ���� ������ MAS ���忡�� ��Ȱ��ȭ�˴ϴ�:

* `crash-reporter`
* `auto-updater`

�׸��� ���� �������� ��ü�˴ϴ�:

* ���� ĸ�� ����� ��� ��ġ���� �۵����� ���� �� �ֽ��ϴ�.
* Ư�� ���ټ� ����� �۵����� ���� �� �ֽ��ϴ�.
* ���ø����̼��� DNS�� ������ �������� ���� �� �ֽ��ϴ�.

���� ���ø����̼� ����ڽ� ������� ���� ���ø����̼ǿ��� ������ �� �ִ� ���ҽ��� �����ϰ� ���ѵǾ� �ֽ��ϴ�.
�ڼ��� ������ [App Sandboxing][app-sandboxing] ������ �����ϼ���.

[submitting-your-app]: https://developer.apple.com/library/mac/documentation/IDEs/Conceptual/AppDistributionGuide/SubmittingYourApp/SubmittingYourApp.html
[nwjs-guide]: https://github.com/nwjs/nw.js/wiki/Mac-App-Store-%28MAS%29-Submission-Guideline#first-steps
[enable-app-sandbox]: https://developer.apple.com/library/ios/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/EnablingAppSandbox.html
[create-record]: https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/CreatingiTunesConnectRecord.html
[submit-for-review]: https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SubmittingTheApp.html
[app-sandboxing]: https://developer.apple.com/app-sandboxing/

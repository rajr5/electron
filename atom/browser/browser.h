// Copyright (c) 2013 GitHub, Inc.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

#ifndef ATOM_BROWSER_BROWSER_H_
#define ATOM_BROWSER_BROWSER_H_

#include <string>
#include <vector>

#include "base/basictypes.h"
#include "base/memory/scoped_ptr.h"
#include "base/compiler_specific.h"
#include "base/observer_list.h"
#include "atom/browser/atom_process_singleton.h"
#include "atom/browser/browser_observer.h"
#include "atom/browser/window_list_observer.h"

#if defined(OS_WIN)
#include "base/files/file_path.h"
#include "base/strings/string16.h"
#endif

namespace base {
class FilePath;
}

namespace ui {
class MenuModel;
}

namespace atom {

// This class is used for control application-wide operations.
class Browser : public WindowListObserver {
 public:
  Browser();
  ~Browser();

  static Browser* Get();

  // Try to close all windows and quit the application.
  void Quit();

  // Cleanup everything and shutdown the application gracefully.
  void Shutdown();

  // Focus the application.
  void Focus();

  // Returns the version of the executable (or bundle).
  std::string GetVersion() const;

  // Overrides the application version.
  void SetVersion(const std::string& version);

  // Returns the application's name, default is just Atom-Shell.
  std::string GetName() const;

  // Overrides the application name.
  void SetName(const std::string& name);

  // Add the |path| to recent documents list.
  void AddRecentDocument(const base::FilePath& path);

  // Clear the recent documents list.
  void ClearRecentDocuments();

  void InitializeSingleInstance();
  ProcessSingleton::NotifyResult GetSingleInstanceResult();
  void SetSingleInstanceCallback(ProcessSingleton::NotificationCallback callback);

#if defined(OS_MACOSX)
  // Bounce the dock icon.
  enum BounceType {
    BOUNCE_CRITICAL = 0,
    BOUNCE_INFORMATIONAL = 10,
  };
  int DockBounce(BounceType type);
  void DockCancelBounce(int request_id);

  // Set/Get dock's badge text.
  void DockSetBadgeText(const std::string& label);
  std::string DockGetBadgeText();

  // Hide/Show dock.
  void DockHide();
  void DockShow();

  // Set docks' menu.
  void DockSetMenu(ui::MenuModel* model);
#endif  // defined(OS_MACOSX)

#if defined(OS_WIN)
  struct UserTask {
    base::FilePath program;
    base::string16 arguments;
    base::string16 title;
    base::string16 description;
    base::FilePath icon_path;
    int icon_index;
  };

  // Add a custom task to jump list.
  void SetUserTasks(const std::vector<UserTask>& tasks);

  // Set the application user model ID, called when "SetName" is called.
  void SetAppUserModelID(const std::string& name);
#endif

  // Tell the application to open a file.
  bool OpenFile(const std::string& file_path);

  // Tell the application to open a url.
  void OpenURL(const std::string& url);

  // Tell the application that application is activated with visible/invisible
  // windows.
  void Activate(bool has_visible_windows);

  // Tell the application the loading has been done.
  void WillFinishLaunching();
  void DidFinishLaunching();

  // Called when client certificate is required.
  void ClientCertificateSelector(
      content::WebContents* web_contents,
      net::SSLCertRequestInfo* cert_request_info,
      scoped_ptr<content::ClientCertificateDelegate> delegate);

  void AddObserver(BrowserObserver* obs) {
    observers_.AddObserver(obs);
  }

  void RemoveObserver(BrowserObserver* obs) {
    observers_.RemoveObserver(obs);
  }

  bool is_quiting() const { return is_quiting_; }
  bool is_ready() const { return is_ready_; }

 protected:
  // Returns the version of application bundle or executable file.
  std::string GetExecutableFileVersion() const;

  // Returns the name of application bundle or executable file.
  std::string GetExecutableFileProductName() const;

  // Send the will-quit message and then shutdown the application.
  void NotifyAndShutdown();

  // Send the before-quit message and start closing windows.
  bool HandleBeforeQuit();

  bool is_quiting_;

 private:
  // WindowListObserver implementations:
  void OnWindowCloseCancelled(NativeWindow* window) override;
  void OnWindowAllClosed() override;

  bool OnProcessSingletonNotification(
    const base::CommandLine& command_line,
    const base::FilePath& current_directory);

  // Observers of the browser.
  base::ObserverList<BrowserObserver> observers_;

  // Whether "ready" event has been emitted.
  bool is_ready_;

  // The browse is being shutdown.
  bool is_shutdown_;

  std::string version_override_;
  std::string name_override_;

  scoped_ptr<AtomProcessSingleton> process_singleton_;
  ProcessSingleton::NotifyResult process_notify_result_;
  ProcessSingleton::NotificationCallback process_notify_callback_;
  bool process_notify_callback_set_;

#if defined(OS_WIN)
  base::string16 app_user_model_id_;
#endif

  DISALLOW_COPY_AND_ASSIGN(Browser);
};

}  // namespace atom

#endif  // ATOM_BROWSER_BROWSER_H_

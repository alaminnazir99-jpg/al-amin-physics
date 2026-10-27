package com.alamin.physics;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware Back Button Handler: Handle SPA sub-views & modals without hard-reloading index.html
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (webView == null) {
                    moveTaskToBack(true);
                    return;
                }

                // First evaluate in-app JS hardware back (closes modals or navigates to dashboard)
                webView.evaluateJavascript("typeof handleAppHardwareBack === 'function' ? handleAppHardwareBack() : false", value -> {
                    if ("true".equalsIgnoreCase(value)) {
                        // Successfully handled in SPA without exiting or reloading
                        return;
                    }

                    // Otherwise check standard WebView navigation stack
                    if (webView.canGoBack()) {
                        webView.goBack();
                    } else {
                        // At root page or no more history: minimize cleanly to background
                        moveTaskToBack(true);
                    }
                });
            }
        });
    }
}

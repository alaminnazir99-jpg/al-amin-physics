package com.alamin.physics;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware Back Button Handler: Navigate back in webview history instead of closing app
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    // If no more history in current page, check if we can go to home index.html
                    if (webView != null && webView.getUrl() != null && !webView.getUrl().endsWith("index.html") && !webView.getUrl().endsWith("/")) {
                        webView.loadUrl("https://localhost/index.html");
                    } else {
                        // At root page: minimize app to background instead of destroying/crashing
                        moveTaskToBack(true);
                    }
                }
            }
        });
    }
}

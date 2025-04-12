
// Chrome extension message handling service

// Initialize chrome.runtime if it doesn't exist in the window object
if (!window.chrome) {
  window.chrome = {} as any;
}
if (!window.chrome.runtime) {
  window.chrome.runtime = {} as any;
}

// Check if onMessage exists, if not create a mock implementation
if (!window.chrome.runtime.onMessage) {
  window.chrome.runtime.onMessage = {
    addListener: (callback: any) => {
      console.log("Mock Chrome message listener added");
      
      // Store the listener in window for potential future use
      if (!window._chromeMessageListeners) {
        window._chromeMessageListeners = [];
      }
      window._chromeMessageListeners.push(callback);
      
      // We could also implement a way to trigger this for testing
      window._triggerChromeMessage = (request: any) => {
        console.log("Triggering mock Chrome message", request);
        const mockSender = { id: "mock-extension-id" };
        const mockSendResponse = (response: any) => {
          console.log("Mock response:", response);
        };
        
        callback(request, mockSender, mockSendResponse);
      };
    },
    removeListener: (callback: any) => {
      console.log("Mock Chrome message listener removed");
      
      if (window._chromeMessageListeners) {
        window._chromeMessageListeners = window._chromeMessageListeners.filter(
          (listener: any) => listener !== callback
        );
      }
    }
  };
}

// The actual message handling logic
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message type matches.
  if (request.type === "myMessageType") {
    try {
      // Simulate an asynchronous operation.
      setTimeout(() => {
        // Perform any needed operations.
        console.log("Message received and processed.");

        // Send a response back to the sender.
        sendResponse({ success: true, data: "Response Data" });
      }, 1000); // 1-second delay
    } catch (error) {
      console.error("Error processing message:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Indicate that sendResponse will be used asynchronously.
  }
  return false;
});

// Export methods to interact with Chrome messaging
export const chromeMessageService = {
  // Method to send a message to the extension
  sendMessage: (message: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Chrome runtime error:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      } else {
        console.warn("Chrome runtime API not available, using mock");
        // If we're in a mock environment, simulate a response
        setTimeout(() => {
          resolve({ success: true, mock: true, data: "Mock Response" });
        }, 500);
      }
    });
  },
  
  // Method to test if Chrome messaging is available
  isAvailable: (): boolean => {
    return !!(window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage);
  }
};

export default chromeMessageService;

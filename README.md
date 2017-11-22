# WhatsApp log parser

Node.js parser for WhatsApp log files.

- [Saving your chat history (Android)](https://faq.whatsapp.com/en/android/23756533/?category=5245251)
- [Saving your chat history (iPhone)](https://faq.whatsapp.com/en/iphone/20888066/#email)

#### Limitations
- Only works with log files exported from systems that use English as the default language

### Installation

```sh
$ npm install -g wa-log-parser
```

### Usage

#### CLI
```sh
$ wa-log-parser ./whatsapp-log-file.txt
```

#### JavaScript
```javascript
const waLogParser = require('wa-log-parser');

waLogParser
	.parse('./whatsapp-log-file.txt')
	.then(data => {
		console.log(JSON.stringify(data, null, 2));
	});
```
### Example

```sh
$ wa-log-parser ./whatsapp-log-file.txt
{                                                                                                                   
  "messages": [                                                                                                     
    {                                                                                                               
      "type": "info",                                                                                               
      "date": "2017-10-02T18:26:00.000Z",                                                                           
      "sender": "system",                                                                                           
      "body": "Messages to this group are now secured with end-to-end encryption. Tap for more info."               
    },                                                                                                              
    {                                                                                                               
      "type": "info",                                                                                               
      "date": "2017-10-02T18:26:00.000Z",                                                                           
      "sender": "system",                                                                                           
      "body": "You created group \"Test group\""                                                                    
    },                                                                                                              
    {                                                                                                               
      "type": "message",                                                                                            
      "date": "2017-10-02T18:26:00.000Z",                                                                           
      "sender": "User",                                                                                             
      "body": ":)"                                                                                                  
    }
  ]
}
```

## License
The MIT License (MIT), Copyright (c) 2017 Jesse Rauha
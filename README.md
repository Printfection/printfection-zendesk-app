## Zendesk App from Printfection to Generate Gift URLs in a Ticket

This Zendesk app allows users to specify their **Printfection API Key** and **Printfection Giveaway Campaign ID** in the app settings. From there Zendesk users can then generate Gift URLs right inside Zendesk tickets. Gift URLs are returned neatly within a lightbox modal where the link can easily be copied.

### Installation

1. Within Zendesk go to **Settings > Apps > Manage** and choose the **Upload Private App** option in the top right.
2. Once uplaoded, in the **App Configuration** tab input your _Printfection API Key_ (located in Printfection at **Account > API Access**) and _Giveaway Campaign ID_ (located in the URL bar right after **?storeid=** inside Printfection).
3. Save your App Configuration settings
4. Make sure the Printfection Givewaway Campaign you specified is set to **Running** and is fully configured with items.
5. That's it! You're done.

### Using the App

In Zendesk you can go to any existing ticket and see the Printfection section in the sidebar. There's a button to **Get a New Gift URL**, when you click it you will be presented with a brand new Giveaway Gift Link from your campaign. You can easily copy it and add it to the ticket.

#### Licesnse

Licensed under Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0).
# Exchange Voting Portal Framework

Developed by shEOS, EOS Rio, NodeONE, GenerEOS

A framework for crypto exchanges to easily implement end-user voting for EOSIO-based blockchains into their existing exchange portal.


## Background

EOS is a delegated proof of stake (DPOS) blockchain with 21 block producers (BPs) actively running, securing and governing the network. On top of those active producers there are hundreds of block producer candidates competing to become an active producer. EOS token holders can vote for up to 30 of their favourite BPs per EOS they own and have staked. The 21 block producers with the highest number of votes at any given time are automatically set as the current active block producers.

With hundreds of block producer candidates it can be overwhelming for some community members to research every one of them and select the BPs to vote for. To ease this process for token holders, they can delegate their voting power to a proxy with a voting philosophy that aligns with their values.

Either one of the voting options above requires the user to have active control of their EOS account in order to sign and broadcast the transaction to vote on-chain. Since a lot of EOS token holders keep their EOS tokens on custodial crypto exchanges, they cannot use their tokens to vote and are therefore excluded from an important aspect of the EOS governance process. Some exchanges have implemented voting tools into their user interface for their users to vote for BPs. However those portals are often hard to use, the Bitfinex Ballot is an example of such a tool. Many exchanges just vote for the BPs they like or that they are affiliated with. Other exchanges don&#39;t want to get into the crossfire of the community and don&#39;t vote at all.

The block producer candidates shEOS, EOS Rio, Node One, and GenerEOS have teamed up with the aim of democratising and streamlining the exchange voting process. They have implemented an open source end-to-end voting framework that any exchange can utilise within their operations with minimal integration efforts and offer their exchange users the ability to participate in the EOS block producer voting process.



## Voting User Interface

The framework provides boilerplate code to integrate a user interface for the listing and selection of block producers / proxies as well as the current breakdown of user votes for the exchange. To ease the portal integration process with the exchange, we provide a UI template in some of the more popular front-end frameworks such as React, Vue, and AngularJS. .

### User Authentication

The provided user interface sample code is recommended to be integrated and branded according to the exchange&#39;s user portal and utilise the same authentication methods in-place. Therefore, our portal interface is built on the assumption that users who access the voting URL have been authenticated and authorised as compliant users on the exchange. We also assume that the user details are stored in the state / session and are accessible within the frontend to communicate relevant information (such as user&#39;s staked EOS amounts, account ID, etc) to the voting backend.

### Communication with voting backend system

The voting frontend communicates with the vote management system (let’s just call it ‘backend’) via REST calls. As the backend runs on a separate instance than the rest of your exchange portal backend systems, some kind of authentication (e.g. JWT or OAuth) is required between those two components before any data can be exchanged via REST calls. (For further details see the documentation of the backend system.) This is to ensure distinction with an exchange’s critical backend infrastructure. The isolated / containerised voting backend system will only require access to a user’s account UID, staked EOS balance and current block producer / proxy vote without direct access to user records (balance transfers / modifications) on the exchange. Those details will be stored within a separate standalone database so no direct access to the central exchange database is required.

### Landing page (EOS governance education)

If the user has no voting record in the backend database, the frontend landing page displays a short introduction of the EOS blockchain governance process and explains the difference between direct / BP voting and Proxy voting. The user is asked to select which mode he would like to start in: BP voting or Proxy voting. The user can switch between those modes at any point in time.

### Voting modes

The UI offers two modes which the users will be able to switch between: BP voting mode or Proxy voting mode. The user can switch between those two modes via Tabs (or Radio Buttons) at the top of the list of BPs/Proxy. The component generates numbered pages, searching and filtering as well as Next / Previous buttons for navigation between pages of BPs / proxies.

## Administration UI

The framework includes a simple user interface for administration purposes. This module can be used to:

1. Query the backend and present the list of BPs with their total votes (default sort order by number of votes as voted by the exchange users)
2. Present some basic statistics: e.g. how many exchange users have participated in the voting process, how much total EOS combined do those users have in the exchange.
3. Present and manage the list of exchange accounts with voting recommendations worked out by the backend system based on the amount of EOS staked in each of the accounts and votes received for the various BPs (details see voting logic details).
4. Generate transactions to vote for all managed exchange accounts based on the voting recommendations worked out. (Signing those transactions might be done offline, depending on the security model chosen, then pushed on-chain via the admin frontend).

## Voting Backend

### OAuth Authentication

Other components (e.g. the voting UI or the Admin UI) need to authenticate against the voting backend via OAuth and receive an authentication token for further requests.

Similarly other exchange backends systems which might need to push updated user details (such as EOS owned) to the voting backend and needs to authenticate first.

Parameters:

- id
- secret

Returns:

- Authentication token

#### GET User Vote

This method will be called by the voting UI to determine how the user previously voted to set the state and display previous vote preference to the user. The UI also uses GET Producer List and GET Proxy List to load all currently registered BPs and Proxies in combination with this method. Note that any producers that have unregistered since the user voted for them need to be removed from the selection and not resubmitted (potentially even making the user aware of the unregistering of a BP they voted for previously).

Header:

- Authentication token

Parameters:

- userID

Returns:

- ProxyVote (boolean)
- List of BPs (or proxy) previously voted for

#### POST User Vote

This method will be called by the voting UI when the user submits their vote. It checks that a valid proxy or a valid list of BPs was submitted (i.e. min 1, max 30 entries, with each submitted BP account name currently registered as a producer). The logic then updates the respective database record for this user.

Header:

- Authentication token

Parameters:

- userID
- ProxyVote (boolean)
- List of up to 30 BP account names (or 1 proxy account name)

Returns:

- n/a

#### POST User Details

This method needs to be called by your exchange backend dealing with buy/sell orders to update the user&#39;s EOS balance in the voting backend in case EOS gets sold or additional EOS bought to update the voting weight of the user.

Header:

- Authentication token

Parameters:

- userID
- EOS owned

Returns:

- n/a

#### GET Producer List

This method will be called by the voting UI to receive a list of currently registered BPs to render in the voting table.

URL: '/api/producers'

Header:

- Authentication token

Parameters:

- n/a

Returns:

- Array:
  - BP logo URL
  - BP name
  - BP website
  - BP global total votes
  - BP global vote percentage

#### GET Proxy List

Returns a list of all proxies that should be displayed in the UI for users to choose from. This list can be 'hard-coded' via the config file. If no proxies are listed in the configuration, all registered proxies with proxy information will be loaded from the Aloha producer details table.

URL: '/api/proxies'

Header:

- Authentication token

Parameters:

- n/a

Returns:

- Array:
  - Proxy logo URL
  - Proxy name
  - Proxy website
  - Proxy background
  - Proxy philosophy
  - Proxy total votes delegated
  - List: BPs voted for


#### GET Voting Statistics

Returns information about the current voting status to be displayed in the admin interface

URL: '/api/statistics'

Header:

- Authentication token

Parameters:

- n/a

Returns:

- Array:
  - Map: BPs voted for and total votes received (ordered by total votes decending)
  - Number of users that participated in voting
  - Total EOS owned by users who voted
  - Total EOS owned by all users of the exchange


#### GET Exchange Wallet Details

Returns a list of all configured exchange wallet that are used to vote with. Details returned includes how much EOS is stored in each wallet and which BPs are currently voted for with each wallet.

URL: '/api/statistics'

Header:

- Authentication token

Parameters:

- n/a

Returns:

- Array:
  - Array: Cold wallet address, total staked EOS, List of BPs voted for
  

## Appendix

### Recommended Security Practice

The following is a list of recommended Security Practice for Key Management. We will first provide a summary about the EOSIO permission system and point you to some curated list of resources to read up on this important topic. Next we will provide a detailed guide on how to set up a special permissions for voting and linking it to your account(s). Finally we will explain how the keys that control the newly created voting permission can be stored and managed securely. We will run through various options and explain how each of those options change the way our voting framework works.

#### EOSIO permission system

The active key….. Bla bla

The owner key …. Bla blub

How to create a special vote permission and link it to your account

It is recommended to create a separate voting account with auth over each cold wallet balance. With each voting account, setup a custom named voting key-permission and link it to the eosio voteproducer action. This arrangement is meant to minimise the exposure impact in the unlikely event that the voting key is compromised.

The following are a set of commands to setup/remove as well as link/unlink custom permissions to each voting account as well as the command to run to vote for a registered bp or proxy.

**Set a new custom voting permission**

`cleos set account permission **exchange_account** **custom_named_voting_permission** &#39;{&quot;threshold&quot;:1, &quot;keys&quot;: [{&quot;key&quot;:&quot;&quot;,&quot;weight&quot;:1}]}&#39; active -p **exchange_account** `

Note: You can save the json string defining the authority to a file for easy reuse

To have contract code vote on behalf of the exchange voting account

`cleos set account permission **exchange_account** **custom_named_voting_permission** **contract**@eosio.code active -p **exchange_account**`

**Remove an existing permission (don't forget to unlink the permission first!)**

`cleos set account permission **exchange_account** **custom_named_voting_permission** NULL active -p **exchange_account**`

**Link the custom named voting permission to vote action**

`cleos set action permission **exchange_account** eosio voteproducer **custom_named_voting_permission** `

**Remove|unlink the permission from the vote action**

`cleos set action permission **exchange_account** eosio voteproducer NULL`

**Vote for a bp/proxy**

`cleos system voteproducer [prods|proxy] **account_name** **registered bp/proxy_name**`

Note

Replace **** with the associated account\_name/custom voting permission name

Choose one from among [a|b]

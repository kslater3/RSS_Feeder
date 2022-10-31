
import { useState, useEffect } from 'react';

import './App.css';

import LinkScroller from '../link_scroller/LinkScroller';
import FeedScroller from '../feed_scroller/FeedScroller';



function validate_url(url) {
    let isValid = false;

    try {
        let urlObj = new URL(url);

        isValid = true;
    }catch(e) {
        isValid = false;

        console.error(e.message);
    }

    return isValid;
}


function fetchRSS(url) {
    return new Promise(async (resolve, reject) => {
        let feed = {};

        if(!validate_url(url)) {
            reject(new Error('Invalid URL passed to fetchRSS: ' + url));

            return;
        }

        let parser = new window.RSSParser();

        try {
            let rssResults = await parser.parseURL(window.location.origin + '/corsproxy/' + url);

            resolve(rssResults);
        }catch(e) {
            reject(e);

            return;
        }
    });
}



function App(props) {
    const [user, setUser] = useState(undefined);
    const [fetchingUser, setFetchingUser] = useState(true);

    const [linkInput, setLinkInput] = useState('');
    const [badLink, setBadLink] = useState(false);

    const [linkRecords, setLinkRecords] = useState([]);
    const [fetchingLinkRecords, setFetchingLinkRecords] = useState(false); // for running only once
    const [loadingLinkRecords, setLoadingLinkRecords] = useState(true); // Still loading when initializing

    const [currentLink, setCurrentLink] = useState(undefined);
    const [loadingRSS, setLoadingRSS] = useState(false);
    const [rssData, setRssData] = useState([]);


    useEffect(() => {
        if(fetchingUser) {
            setFetchingUser(false);

            fetch('/session').then((response) => {
                response.json().then((tempUser) => {
                    if(tempUser) {
                        setUser({...tempUser});
                    }

                    setFetchingLinkRecords(true);
                }).catch((e) => {
                    console.error(e.message);
                });
            }).catch((e) => {
                console.error(e.message);
            });
        }
    });


    useEffect(() => {
        if(fetchingLinkRecords) {
            setFetchingLinkRecords(false);

            fetch('/userlinks/' + user.id).then((response) => {
                response.json().then((tempLinks) => {
                    if(tempLinks && tempLinks.rows.length) {
                        setLinkRecords(tempLinks.rows);
                    }
                }).catch((e) => {
                    console.error(e.message);
                });
            }).catch((e) => {
                console.error(e.message);
            });
        }
    });


   async function addLink() {
       if(!validate_url(linkInput)) {
           setBadLink(true);

           return;
       }

       if(!user) {
           console.error('SCRIPT ERROR: Cannot Add Link, User is undefined');

           return;
       }

       let rssResponse = await fetchRSS(linkInput);

       if(rssResponse) {
           try {
               let linkPost = await fetch('/link/' + user.id, {
                   method: 'POST',

                   headers: {
                       'Content-Type': 'application/json'
                   },

                   body: JSON.stringify({
                       link: linkInput,

                       label: rssResponse.title
                   })
               });

               if(linkPost.ok) {
                   updateRSSData(linkInput);

                   setLinkInput('');

                   setFetchingLinkRecords(true);
               }else {
                   setBadLink(true);
               }
           }catch(e) {
               console.error(e);

               setBadLink(true);
           }


       }
   }



   async function updateRSSData(url) {
       setLoadingRSS(true);

       let tempRssData = await fetchRSS(url);

       if(tempRssData && tempRssData.items) {
           setRssData({...tempRssData});
       }

       setLoadingRSS(false);
   }


   async function logout() {
       try {
           const response = await fetch('/logout', {
               method: 'POST',

               body: ''
           });

           if(!response.ok) {
               alert('Failed to Log Out, Something Went Wrong');
           }else {
               // Browser does not like to redirect after log in
               window.location.href = window.location.origin;
           }
       }catch(e) {
           console.error(e.message);
       }
   }



    return (
        <div id="App_Base">
            <div id="header_container">
                <div>
                    <b>RSS Link:</b>
                    <input
                        type="text"
                        onInput={(e) => {
                            setLinkInput(e.target.value);
                        }}
                    ></input>
                </div>

                <img
                    src="images/plus_icon.png"
                    alt="Img Failed to Load"
                    id="plus_icon"
                    onClick={addLink}
                />

                <button
                    id="logout_button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <div id="link_error_container">
                <p id="link_error_p">
                    {badLink &&
                        "Bad Link"
                    }
                </p>
            </div>


            <div id="feed_container">
                <div className="instructions_div">
                    <b>Instructions:</b> Add Links up top. Select a Link. Click the Read button on an article. See the article at the bottom.
                </div>

                <div id="linkscroller_container">
                    <LinkScroller
                        linkRecords={linkRecords}

                        setCurrentLink={(newLink) => {
                            setCurrentLink({...newLink});

                            updateRSSData(newLink.link);
                        }}
                    >
                    </LinkScroller>
                </div>

                <div id="feedscroller_container">
                    <FeedScroller rssData={rssData}></FeedScroller>
                </div>
            </div>
        </div>
    );
}

export default App;

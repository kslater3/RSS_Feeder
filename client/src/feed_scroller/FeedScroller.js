
import { useState } from 'react';

import './FeedScroller.css';

import FeedContainer from '../feed_container/FeedContainer';


function ConditionalScroller(props) {
    if(props.loadingRSS) {
        return (
            <div id="spinner">
            </div>
        );
    }

    return(
        <div>
            {props.currentLink &&
                <div id="feed_title">
                    <h2>{props.currentLink.label}</h2>
                </div>
            }

            <div className="sidescroller">
                {props.stubs.length ? props.stubs : <h1>WOW, Such Empty</h1>}
            </div>
        </div>
    );
}



function FeedScroller(props) {
    let stubs = [];

    if(props.rssData && props.rssData.items) {
        stubs = props.rssData.items.map((entry) => {
            return (
                <div className="feed_wrapper">
                    <FeedContainer item={entry}></FeedContainer>
                </div>
            );
        });
    }


    return (
        <div id="FeedScroller_Base">
            <ConditionalScroller
                isLoading={props.loadingRSS}
                stubs={stubs}

                currentLink={props.currentLink}
            >
            </ConditionalScroller>
        </div>
    );
}

export default FeedScroller;

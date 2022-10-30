
import { useState } from 'react';

import './LinkScroller.css';



function extract_domain(url) {
    let domain = '';

    try {
        let urlObj = new URL(url);

        domain = urlObj.hostname.replace('www.', '');
    }catch(e) {
        console.error(e.message);
    }

    return domain;
}


function groupDomains(linkRecords) {
    let domainGroups = {};

    for(let i = 0; i < linkRecords.length; i++) {
        let domain = extract_domain(linkRecords[i].link);

        if( !(domain in Object.keys(domainGroups)) ) {
            domainGroups[domain] = [];
        }

        domainGroups[domain].push(linkRecords[i]);
    }

    return domainGroups;
}



function LinkScroller(props) {
    let domainGroups = groupDomains(props.linkRecords);

    let linkComponents = [];

    if(domainGroups && domainGroups !== {}) {
        linkComponents = Object.keys(domainGroups).sort().map((domain) => {
            let links = domainGroups[domain].sort((left, right) => {
                if(left.link > right.link) {
                    return 1;
                }

                if(left.link < right.link) {
                    return -1;
                }

                return 0;
            }).map((record) => {
                return (
                    <div
                        className="domain_link"
                        onClick={() => {
                            props.setCurrentLink(record);
                        }}
                    >
                        {record.label}
                    </div>
                );
            });


            return (
                <div className="domain_container">
                    <div className="domain_title">
                        <b>{domain}</b>
                    </div>

                    <div className="domain_links">
                        {links}
                    </div>
                </div>
            );
        });
    }


    return (
        <div id="LinkScroller_Base">
            {linkComponents.length ? linkComponents : <h4>WOW, Such Empty</h4>}
        </div>
    );
}

export default LinkScroller;
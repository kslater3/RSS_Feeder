
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
    let domain;

    for(let i = 0; i < linkRecords.length; i++) {
        domain = extract_domain(linkRecords[i].link);

        if(!domainGroups.hasOwnProperty(domain)) {
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
                    <button
                        className="domain_link"
                        onClick={() => {
                            props.setCurrentLink(record);
                        }}
                    >
                        {record.label}
                    </button>
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
            {linkComponents.length ? linkComponents : <h4>Add a Link Above</h4>}
        </div>
    );
}

export default LinkScroller;

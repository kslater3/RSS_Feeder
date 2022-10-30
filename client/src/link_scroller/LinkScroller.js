
import './LinkScroller.css';


function LinkScroller(props) {

    return (
        <div id="LinkScroller_Base">
            <div className="domain_container">
                <div className="domain_title">
                    reddit
                </div>

                <div className="domain_links">
                    <div className="domain_link">
                        Front Page
                    </div>

                    <div className="domain_link">
                        r/other
                    </div>
                </div>
            </div>

            <div className="domain_container">
                <div className="domain_title">
                    rss.cnn
                </div>

                <div className="domain_links">
                    <div className="domain_link">
                        Today's News
                    </div>

                    <div className="domain_link">
                        World News
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LinkScroller;

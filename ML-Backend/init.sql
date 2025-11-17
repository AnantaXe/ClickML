-- 1. Create a database
CREATE DATABASE phishing_db;

-- 2. Connect to the database
\c phishing_db;

-- 3. Create the phishing dataset table (PostgreSQL compatible)
CREATE TABLE phishing_dataset (
    id SERIAL PRIMARY KEY,

    having_ip_address INT,
    url_length INT,
    shortining_service INT,
    having_at_symbol INT,
    double_slash_redirecting INT,
    prefix_suffix INT,
    having_sub_domain INT,
    sslfinal_state INT,
    domain_registeration_length INT,
    favicon INT,
    port INT,
    https_token INT,
    request_url INT,
    url_of_anchor INT,
    links_in_tags INT,
    sfh INT,
    submitting_to_email INT,
    abnormal_url INT,
    redirect INT,
    on_mouseover INT,
    rightclick INT,
    popupwidnow INT,
    iframe INT,
    age_of_domain INT,
    dnsrecord INT,
    web_traffic INT,
    page_rank INT,
    google_index INT,
    links_pointing_to_page INT,
    statistical_report INT,

    result INT   -- target column
);

INSERT INTO phishing_dataset (
    having_ip_address, url_length, shortining_service, having_at_symbol,
    double_slash_redirecting, prefix_suffix, having_sub_domain, sslfinal_state,
    domain_registeration_length, favicon, port, https_token, request_url,
    url_of_anchor, links_in_tags, sfh, submitting_to_email, abnormal_url,
    redirect, on_mouseover, rightclick, popupwidnow, iframe, age_of_domain,
    dnsrecord, web_traffic, page_rank, google_index, links_pointing_to_page,
    statistical_report, result
) VALUES
-- 1 Legitimate
(-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,-1,-1,1),

-- 2 Phishing
(1,1,1,1,1,1,1,-1,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,1,1,-1),

-- 3 Suspicious
(0,1,-1,0,1,1,0,0,1,0,1,-1,0,-1,0,1,-1,0,1,0,-1,1,-1,0,0,1,0,1,0,-1,0),

-- 4 Legitimate
(-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,-1,1,-1,-1,1),

-- 5 Phishing
(1,1,1,1,1,1,1,-1,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,-1,1,-1,1,1,-1),

-- 6 Suspicious mix
(0,1,0,-1,1,0,1,0,0,-1,1,0,-1,1,-1,0,1,1,0,1,-1,1,0,-1,0,1,-1,0,1,-1,0),

-- 7 Legitimate
(-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,-1,1,-1,-1,1),

-- 8 Suspicious
(0,1,1,0,1,0,0,-1,1,1,0,0,1,-1,1,0,0,1,1,0,0,1,0,-1,0,1,-1,1,0,1,0),

-- 9 Phishing
(1,1,1,1,1,1,1,-1,-1,1,1,1,1,1,-1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,1,1,-1),

-- 10 Legitimate-safe
(-1,-1,-1,-1,-1,-1,-1,1,1,-1,0,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,1,1,1,1,1,-1,-1,1);
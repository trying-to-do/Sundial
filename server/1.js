function post(url, data, sucessCallback, failCallBack) {
    let xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function (ev) {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    sucessCallback(this.responseText);
            }
            else {
                failCallBack(this.status);
            }
        }
    }
}
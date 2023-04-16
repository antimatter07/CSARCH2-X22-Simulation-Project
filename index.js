$(document).ready(function () {

    // ----------------- Capunitan --------------------- //
    // default selected
    var selected_bcd = "dec-to-ubcd"
    var selected_unicode = "uc-to-utf8"

    $("#unicode-inputs").hide();

    // Update input box placeholder
    $('#dec-to-ubcd').click(function () {
        $("#bcd-input").attr('placeholder', "Enter Decimal");
    })

    $('#dec-to-pbcd').click(function () {
        $("#bcd-input").attr('placeholder', "Enter Decimal");
    })

    $('#dec-to-dpbcd').click(function () {
        $("#bcd-input").attr('placeholder', "Enter Decimal");
    })

    $('#dpbcd-to-dec').click(function () {
        $("#bcd-input").attr('placeholder', "Enter Densely Packed BCD");
    })


    // switching BCD <-> Unicode
    $('#bcd-btn').click(function () {
        $('.form-check-input').prop('checked', false);
        $('#dec-to-ubcd').prop('checked', true);
        $("#bcd-input").attr('placeholder', "Enter Decimal");
        selected_bcd = "dec-to-ubcd";

        $("#bcd-btn").attr('class', 'col-3 btn btn-primary p-2');
        $("#unicode-btn").attr('class', 'col-3 btn btn-outline-primary p-2');

        $("#bcd-inputs").show();
        $("#unicode-inputs").hide();

        $('#copy').text('Download Output as a Text File');
        clear();
    })

    $('#unicode-btn').click(function () {
        $('.form-check-input').prop('checked', false);
        $('#uc-to-utf8').prop('checked', true);
        selected_unicode = "uc-to-utf8"

        $("#bcd-btn").attr('class', 'col-3 btn btn-outline-primary p-2');
        $("#unicode-btn").attr('class', 'col-3 btn btn-primary p-2');

        $("#bcd-inputs").hide();
        $("#unicode-inputs").show();

        $('#copy').text('Copy Output to Clipboard');
        clear();
    })

    $('.clear').click(function () {
        clear();
    })

    function clear() {
        $("#answer-header").text("Choose a converter from the left panel, then enter your input into the text box.");
        $(".input-box").val('');
        $('#input').text('');
        $('#output').text('');
    }

    // Change chosen convert option
    $('.form-check-input').click(function () {
        mode = $(this).parent().parent().attr('id');

        if (mode == "bcd-inputs") {
            selected_bcd = $(this).attr('id');
        } else selected_unicode = $(this).attr('id');

        clear();
    })

    // BCD Converter
    // TODO: Validate Decimal and BCD
    $('#bcd-convert').click(function () {
        let input = $('#bcd-input').val();

        switch (selected_bcd) {
            case 'dec-to-ubcd':
                $("#answer-header").text("Converting Decimal to Unpacked BCD");
                break;
            case 'dec-to-pbcd':
                $("#answer-header").text("Converting Decimal to Packed BCD");
                break;
            case 'dec-to-dpbcd':
                $("#answer-header").text("Converting Decimal to Densely Packed BCD");
                break;
            case 'dpbcd-to-dec':
                $("#answer-header").text("Converting Densely Packed BCD to Decimal");
                break;
        }

        if (validateDecimal(input)) {
            switch (selected_bcd) {
                case 'dec-to-ubcd': decToUnpackedBCD(input);
                    break;
                case 'dec-to-pbcd': decToPackedBCD(input);
                    break;
                case 'dec-to-dpbcd': decToDenselyPackedBCD(input);
                    break;
                case 'dpbcd-to-dec':
                    if (validateBinary(input))
                        bcdToDec(input);
                    else {
                        $('#input').text("Invalid binary input. Please try again.");
                        $('#output').text('N/A');
                    }
                    break;
            }
        }
        else {
            $('#input').text("Invalid decimal input. Please try again.");
            $('#output').text('N/A');
        }

    })

    // Unicode Converter
    $('#unicode-convert').click(function () {
        let input = $('#unicode-input').val();

        switch (selected_unicode) {
            case 'uc-to-utf8': $("#answer-header").text("Converting Unicode to UTF-8");
                break;
            case 'uc-to-utf16': $("#answer-header").text("Converting Unicode to UTF-16");
                break;
            case 'uc-to-utf32': $("#answer-header").text("Converting Unicode to UTF-32");
                break;
        }

        if (validateUnicode(input)) {
            switch (selected_unicode) {
                case 'uc-to-utf8': console.log("TBU");
                    break;
                case 'uc-to-utf16': console.log("TBU");
                    break;
                case 'uc-to-utf32': convertToUTF32(input);
                    break;
            }
        }
        else {
            $('#input').text("Invalid unicode input. Please try again. (Note: The 'U+' notation must be included in the input) ");
            $('#output').text('N/A');
        }
    })


    $("#copy").click(function () {
        if ($('#copy').text() == 'Download Output as a Text File') {
            var output = $('#output').text();
            var data = new Blob([output], { type: 'text/plain' });

            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'output.txt');
            downloadLink.setAttribute('href', window.URL.createObjectURL(data));
            downloadLink.click();

        }
        else {  // copy text inside output box into clipboard
            var r = document.createRange();
            r.selectNode(document.getElementById('output'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(r);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    })


    /* -------- CONVERTER FUNCTIONS -------- */

    function validateDecimal(string) {
        return string.match(/^[0-9]+$/) != null;
    }

    function validateBinary(string) {
        return string.match(/^[0-1]+$/) != null;
    }

    // ----------------- Santiago --------------------- //
    function decToUnpackedBCD(input) {
        var temp = "";
        var i = 0;
        var unpackedBCD = "";
        var append = "0000 ";

        for (i = 0; i < input.length; i++) {
            switch (input[i]) {
                case "0": temp = append + "0000 ";
                    break;
                case "1": temp = append + "0001 ";
                    break;
                case "2": temp = append + "0010 ";
                    break;
                case "3": temp = append + "0011 ";
                    break;
                case "4": temp = append + "0100 ";
                    break;
                case "5": temp = append + "0101 ";
                    break;
                case "6": temp = append + "0110 ";
                    break;
                case "7": temp = append + "0111 ";
                    break;
                case "8": temp = append + "1000 ";
                    break;
                case "9": temp = append + "1001 ";
                    break;
            }
            unpackedBCD += temp;
            temp = "";
        }
        $('#input').text(input);
        $('#output').text(unpackedBCD);
    }


    function decToPackedBCD(input) {
        var packedBCD = "";
        for (i = 0; i < input.length; i++) {
            switch (input[i]) {
                case "0": temp = "0000 ";
                    break;
                case "1": temp = "0001 ";
                    break;
                case "2": temp = "0010 ";
                    break;
                case "3": temp = "0011 ";
                    break;
                case "4": temp = "0100 ";
                    break;
                case "5": temp = "0101 ";
                    break;
                case "6": temp = "0110 ";
                    break;
                case "7": temp = "0111 ";
                    break;
                case "8": temp = "1000 ";
                    break;
                case "9": temp = "1001 ";
                    break;
            }
            packedBCD += temp;
            temp = "";
        }
        $('#input').text(input);
        $('#output').text(packedBCD);
    }


    // ----------------- Castillo --------------------- //
    function decToDenselyPackedBCD(num) {
        var result = "";

        var splitted = Array.from(num.toString()).map(Number);
        var sets = Math.floor(splitted.length / 3);
        var extra = splitted.length % 3;

        var n;
        for (n = 0; n < sets; n++) {
            var end = splitted.length - 3;
            var tri = splitted.slice(-3);
            splitted = splitted.slice(0, end);
            console.log(tri);

            var bin = Array.from(tri.map(toBin4).join(''));
            console.log(bin);

            a = bin[0];
            b = bin[1];
            c = bin[2];
            d = bin[3];
            e = bin[4];
            f = bin[5];
            g = bin[6];
            h = bin[7];
            i = bin[8];
            j = bin[9];
            k = bin[10];
            m = bin[11];

            console.log(a + ' ' + e + ' ' + i);
            var code = codeGet(b, c, d, f, g, h, j, k, m, codeMap(a, e, i));
            result = code + result;
            console.log(code + " ==> " + result);
        }

        if (extra > 0) {
            tri = splitted.join('');
            tri = Array.from(tri.padStart(3, "0")).map(Number);
            console.log(tri);
            bin = Array.from(tri.map(toBin4).join(''));

            a = bin[0];
            b = bin[1];
            c = bin[2];
            d = bin[3];
            e = bin[4];
            f = bin[5];
            g = bin[6];
            h = bin[7];
            i = bin[8];
            j = bin[9];
            k = bin[10];
            m = bin[11];

            console.log(a + ' ' + e + ' ' + i);
            var code = codeGet(b, c, d, f, g, h, j, k, m, codeMap(a, e, i));
            result = code + result;
            console.log(code + " ==> " + result);
        }

        $('#input').text(num);
        $('#output').text(result);
    }

    function toBin4(num) {
        var num_bin = "";

        switch (num) {
            case 0: num_bin = "0000";
                break;
            case 1: num_bin = "0001";
                break;
            case 2: num_bin = "0010";
                break;
            case 3: num_bin = "0011";
                break;
            case 4: num_bin = "0100";
                break;
            case 5: num_bin = "0101";
                break;
            case 6: num_bin = "0110";
                break;
            case 7: num_bin = "0111";
                break;
            case 8: num_bin = "1000";
                break;
            case 9: num_bin = "1001";
                break;
        }

        return num_bin;
    }


    function codeGet(b, c, d, f, g, h, j, k, m, num) {

        switch (num) {
            case 0: return b + c + d + f + g + h + "0" + j + k + m;
                break;
            case 1: return b + c + d + f + g + h + "1" + "0" + "0" + m;
                break;
            case 2: return b + c + d + j + k + h + "1" + "0" + "1" + m;
                break;
            case 3: return b + c + d + "1" + "0" + h + "1" + "1" + "1" + m;
                break;
            case 4: return j + k + d + f + g + h + "1" + "1" + "0" + m;
                break;
            case 5: return f + g + d + "0" + "1" + h + "1" + "1" + "1" + m;
                break;
            case 6: return j + k + d + "0" + "0" + h + "1" + "1" + "1" + m;
                break;
            case 7: return "0" + "0" + d + "1" + "1" + h + "1" + "1" + "1" + m;
                break;
            default: return "Invalide code num";
        }
    }

    function codeMap(a, e, i) {
        var temp = new Array(a, e, i);
        temp = temp.join('');

        switch (temp) {
            case "000": return 0;
                break;
            case "001": return 1;
                break;
            case "010": return 2;
                break;
            case "011": return 3;
                break;
            case "100": return 4;
                break;
            case "101": return 5;
                break;
            case "110": return 6;
                break;
            case "111": return 7;
                break;
            default: return -1;
        }
    }

    const set_len = 10;

    function bcdToDec(num) {
        var result = "";
        var result_bin = "";
        var split = Array.from(num);

        var sets = Math.floor(split.length / set_len);
        var extra = split.length % set_len;

        console.log("Input: " + num);
        console.log();

        for (var i = 0; i < sets; i++) {
            var bin10 = split.slice(-set_len);
            split = split.slice(0, split.length - set_len);
            console.log("Remaining Input: " + split.join(''));
            console.log("Set of 10: " + bin10.join(''));

            var p = bin10[0];
            var q = bin10[1];
            var r = bin10[2];
            var s = bin10[3];
            var t = bin10[4];
            var u = bin10[5];
            var v = bin10[6];
            var w = bin10[7];
            var x = bin10[8];
            var y = bin10[9];

            var bin_exp = bcdExpansion(p, q, r, s, t, u, v, w, x, y);

            result_bin = bin_exp + result_bin;

            console.log("Result: " + result_bin);
            console.log();
        }

        if (extra > 0) {
            var spl_str = split.join('');
            console.log("Remaining Input: " + spl_str);
            var bin = Array.from(spl_str.padStart(10, "0"));
            console.log("Set of 10: " + bin.join(''));

            var p = bin[0];
            var q = bin[1];
            var r = bin[2];
            var s = bin[3];
            var t = bin[4];
            var u = bin[5];
            var v = bin[6];
            var w = bin[7];
            var x = bin[8];
            var y = bin[9];

            var bin_exp = bcdExpansion(p, q, r, s, t, u, v, w, x, y);

            result_bin = bin_exp + result_bin;

            console.log(bin_exp);
            console.log("Result: " + result_bin);
            console.log();
        }

        console.log("Binary: " + result_bin);
        console.log("Length: " + result_bin.length)
        console.log();

        var iterations = result_bin.length / 4;
        for (var j = 0; j < iterations; j++) {
            console.log("Iteration: " + (j + 1))
            var bin4 = result_bin.slice(0, 4);
            result_bin = result_bin.slice(4);
            console.log("Set of 4: " + bin4);
            console.log("Remaining Bin.: " + result_bin);

            result = result.concat(hexMap(bin4));

            if (j % 3 == 0) {
                console.log("HEEEELOOOOOOOOOOOO")
                result = " " + result;
            }
            console.log("Result: " + result);
            console.log();
        }

        $('#input').text(num);
        $('#output').text(result);
    }


    function hexMap(num_str) {
        switch (num_str) {
            case "0000": return "0";
                break;
            case "0001": return "1";
                break;
            case "0010": return "2";
                break;
            case "0011": return "3";
                break;
            case "0100": return "4";
                break;
            case "0101": return "5";
                break;
            case "0110": return "6";
                break;
            case "0111": return "7";
                break;
            case "1000": return "8";
                break;
            case "1001": return "9";
                break;
            default: return -1;
        }
    }


    function bcdExpansion(p, q, r, s, t, u, v, w, x, y) {
        // VWXST
        // 0....
        if (v === "0") {
            return "0" + p + q + r + "0" + s + t + u + "0" + w + x + y;
        }

        // VWXST
        // 1xx..
        if (w === "0") {
            // 10x..
            if (x === "0") {
                // 100..
                return "0" + p + q + r + "0" + s + t + u + "1" + "0" + "0" + y;
            }

            // 101..
            return "0" + p + q + r + "1" + "0" + "0" + u + "0" + s + t + y;
        }

        // VWXST
        // 110..
        if (x === "0") {
            return "1" + "0" + "0" + r + "0" + s + t + u + "0" + p + q + y;
        }

        // VWXST
        // 1110x
        if (s === "0") {
            // 11100
            if (t === "0") {
                return "1" + "0" + "0" + r + "1" + "0" + "0" + u + "0" + p + q + y;
            }

            // 11101
            return "1" + "0" + "0" + r + "0" + p + q + u + "1" + "0" + "0" + y;
        }

        // VWXST
        // 11110
        if (t === "0") {
            return "0" + p + q + r + "1" + "0" + "0" + u + "1" + "0" + "0" + y;
        }

        // VWXST
        // 11111
        return "1" + "0" + "0" + r + "1" + "0" + "0" + u + "1" + "0" + "0" + y;
    }


    // ----------------- Villarica --------------------- //

    //check if validate unicode, and also trims leading 0s and stores
    //input hex string in hexinput
    function validateUnicode(input) {

        const hexToDecimal = hex => parseInt(hex, 16);

        //check for U+
        var firstchar = input.charAt(0)
        var secondchar = input.charAt(1)
        if (firstchar != 'U' || secondchar != '+') {
            return false;
        }

        //check if hex string is within valid unicode range: 00000 - 10FFFF
        //range in decimmal is 0 to 1114111

        //remove 'U+' to isolate hex number
        input = input.replace('U+', '');

        //remove leading 0s from string
        input = input.replace(/^0+/, '');

        //check if string is a valid hex number

        if (!isHex(input)) {
            return false;
        }

        var decimal = hexToDecimal(input)
        if (decimal >= 0 && decimal <= 1114111) {
            return true;
        } else {
            return false;
        }

    }

    /*Determine if string only contains hex characters */
    function isHex(h) {
        var a = parseInt(h, 16);
        return (a.toString(16) === h.toLowerCase())
    }

    function convertToUTF32(hexinput) {

        hexinput = hexinput.replace('U+', '');
        hexinput = hexinput.replace(/^0+/, '');

        //add leading 0s so that it only has 8 nibbles 
        let utf32 = hexinput.padStart(8, "0");

        let spacedUTF32 = insertSpaceEvery2Chars(utf32);

        $('#input').text(hexinput);
        $('#output').text(spacedUTF32);

    }

    /*Takes a string, inserts a space for every 2 chars */
    function insertSpaceEvery2Chars(string) {
        var spaced = "";

        for (var i = 0; i < string.length; i++) {
            if (i % 2 == 1)
                spaced += string.charAt(i - 1) + string.charAt(i) + " "

        }
        //remove trailing spaces
        spaced = spaced.trim()
        return spaced;

    }


})






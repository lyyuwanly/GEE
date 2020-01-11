
/**代码源数据来自孔东东
 * Extract bitcoded QA information from a band and return it as an image.
 * @param {image} QAImage An image with a single bit packed quality assurance
 *     (QA) band.
 * @param {integer} start The position of the starting bit.
 * @param {integer} end The position of the ending bit.
 * @param {string} newName The name given to the new band.
 * @return {image} An image with the extracted QA parameter band.
 * 
 * @usage
 * pkg_main.getQABits(image, start, end)
 */
var getQABits = function(image, start, end, newName) {
    end     = end || start;
    newName = newName || "b1";
    // Compute the bits we need to extract.
    var pattern = 0;
    for (var i = start; i <= end; i++) {
       pattern += Math.pow(2, i);
    }
    return image.select([0], [newName])
                  .bitwiseAnd(pattern)
                  .rightShift(start);
};


/** 
 * qc2bands 
 * 
 * convert QC value to mutiple bands, only suit for 'SummaryQA'
 */
var qc2bands = function(img, band_qc){
    band_qc = band_qc || 'SummaryQA';
    var qc = img.select(band_qc); // missing value is ignored
    
    var good   = qc.updateMask(qc.eq(0)).rename('good');
    var margin = qc.updateMask(qc.eq(1)).rename('margin');
    var snow   = qc.updateMask(qc.eq(2)).rename('snow'); // snow or ice
    var cloud  = qc.updateMask(qc.eq(3)).rename('cloud');
    
    return ee.Image([good, margin, snow, cloud])
        .copyProperties(img, ['system:time_start']);
};

exports = {
    getQABits       : getQABits,
    qc2bands        : qc2bands,
};

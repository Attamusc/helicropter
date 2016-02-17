import $ from 'jquery';
import {proportion, default as PreviewCrop} from 'PreviewCrop';
import images from '../fixtures/images';

function createPreviewCrop($el) {
  const previewCrop = new PreviewCrop();
  previewCrop.render($el);
  return previewCrop;
}

describe('PreviewCrop', function() {
  beforeEach(function(done) {
    this.$el = affix('.js-preview-crop-parent');
    this.previewCrop = createPreviewCrop(this.$el);
    this.$canvas = this.$el.find('.js-preview-crop-canvas');

    this.imageData = {
      image: images.flower,
      scale: 1,
      top: 0,
      left: 0,
      cropWidth: 320,
      cropHeight: 250
    };

    this.previewCrop.renderImage(this.imageData).then(done);
  });

  afterEach(function() {
    this.previewCrop.destroy();
  });

  it('renders', function() {
    expect(this.$canvas).toExist();
  });

  describe('when given an image', function() {
    it('renders a scaled down version', function() {
      expect(this.$canvas).toHaveCss({
        width: this.imageData.cropWidth * proportion + 'px',
        height: this.imageData.cropHeight * proportion + 'px'
      });
    })
  });

  describe('when notified of movement from the main image', function() {
    it('updates the scaled position of the preview', function() {
      const oldLeft = this.previewCrop._image.get('left');
      const oldTop = this.previewCrop._image.get('top');

      this.previewCrop.trigger('moving', {
        left: 100,
        top: 100
      });

      const newLeft = this.previewCrop._image.get('left');
      const newTop = this.previewCrop._image.get('top');

      expect(newTop).not.toBe(oldTop);
      expect(newTop).toBeLessThan(100);

      expect(newLeft).not.toBe(oldLeft);
      expect(newLeft).toBeLessThan(100);
    });
  });

  describe('when the main image scales', function() {
    beforeEach(function() {
      this.scaleData = {
        scale: 0.75,
        left: 100,
        top: 100
      };
    });

    it('also scales the preview', function() {
      const oldScale = this.previewCrop._image.getScaleX();

      this.previewCrop.trigger('scaling', this.scaleData);

      const newScale = this.previewCrop._image.getScaleX();
      expect(newScale).not.toBe(oldScale);
      expect(newScale).toBeLessThan(this.scaleData.scale);
    });

    it('adjusts the position of the preview image accordingly', function() {
      const oldLeft = this.previewCrop._image.get('left');
      const oldTop = this.previewCrop._image.get('top');

      this.previewCrop.trigger('scaling', this.scaleData);

      const newLeft = this.previewCrop._image.get('left');
      const newTop = this.previewCrop._image.get('top');

      expect(newTop).not.toBe(oldTop);
      expect(newTop).toBeLessThan(this.scaleData.top);

      expect(newLeft).not.toBe(oldLeft);
      expect(newLeft).toBeLessThan(this.scaleData.left);
    });
  });
});

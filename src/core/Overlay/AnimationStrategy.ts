import Point from "@/utils/Point";

export type AnimationType = 'scale' | 'translate' | 'clip' | 'none';

const SAFE_CLIP_MARGIN = '-10px';

export class AnimationStrategy {

    #xAnimation: AnimationType = 'none';

    #yAnimation: AnimationType = 'none';

    #scaleX = 1;

    #scaleY = 1;

    #translateX = '0';

    #translateY = '0';

    #opcity = 0;

    #animation?: Animation;

    #duration = 150;

    #element?: HTMLElement;

    scaleX(scale = 0.8) {
        this.#scaleX = scale;
        this.#xAnimation = 'scale';
        return this;
    }

    scaleY(scale = 0.8) {
        this.#scaleY = scale;
        this.#yAnimation = 'scale';
        return this;
    }

    translateX(translate: string) {
        this.#translateX = translate;
        this.#xAnimation = 'translate';
        return this;
    }

    translateY(translate: string) {
        this.#translateY = translate;
        this.#yAnimation = 'translate';
        return this;
    }

    clipX() {
        this.#xAnimation = 'clip';
        return this;
    }

    clipY() {
        this.#yAnimation = 'clip';
        return this;
    }

    opacity(opacity: number) {
        this.#opcity = opacity;
        return this;
    }

    duration(duration: number) {
        this.#duration = duration;
        return this;
    }

    attach(element: HTMLElement) {
        this.#element = element;
        return this;
    }

    apply(originPoint: Point, overlayPoint: Point) {
        if (!this.#element) return;
        if (this.#xAnimation === 'none' && this.#yAnimation === 'none') {
            return;
        }
        const { x, y } = overlayPoint;
        // get the originPoint offset of the overlay
        const offsetX = originPoint.x - x;
        const offsetY = originPoint.y - y;
        // set the overlay transform origin
        this.#element.style.transformOrigin = `${offsetX}px ${offsetY}px`;

        const startKeyFrame: Keyframe = {
            opacity: this.#opcity,
        };

        const endKeyFrame: Keyframe = {
            opacity: 1,
        };
        if (this.#xAnimation === 'scale' || this.#yAnimation === 'scale' || this.#xAnimation === 'translate' || this.#yAnimation === 'translate') {
            startKeyFrame.transform = '';
            endKeyFrame.transform = '';
            if (this.#xAnimation === 'scale') {
                startKeyFrame.transform += `scaleX(${this.#scaleX})`;
                endKeyFrame.transform += `scaleX(1)`;
            } else if (this.#xAnimation === 'translate') {
                startKeyFrame.transform += `translateX(${this.#translateX})`;
                endKeyFrame.transform += `translateX(0)`;
            }
            if (this.#yAnimation === 'scale') {
                startKeyFrame.transform += `scaleY(${this.#scaleY})`;
                endKeyFrame.transform += `scaleY(1)`;
            } else if (this.#yAnimation === 'translate') {
                startKeyFrame.transform += `translateY(${this.#translateY})`;
                endKeyFrame.transform += `translateY(0)`;
            }
        }

        if(this.#xAnimation === 'clip' || this.#yAnimation === 'clip') {
            let top = SAFE_CLIP_MARGIN, right = SAFE_CLIP_MARGIN, bottom = SAFE_CLIP_MARGIN, left = SAFE_CLIP_MARGIN;
            if(this.#xAnimation === 'clip') {
                left = `${offsetX}px`;
                right = `calc(100% - ${offsetX}px)`;
            }
            if(this.#yAnimation === 'clip') {
                top = `${offsetY}px`;
                bottom = `calc(100% - ${offsetY}px)`;
            }
            startKeyFrame.clipPath = `inset(${top} ${right} ${bottom} ${left})`;
            endKeyFrame.clipPath = `inset(${SAFE_CLIP_MARGIN} ${SAFE_CLIP_MARGIN} ${SAFE_CLIP_MARGIN} ${SAFE_CLIP_MARGIN})`;
        }

        // animate the overlay
        this.#animation = this.#element.animate([
            startKeyFrame, endKeyFrame
        ], {
            duration: this.#duration,
            easing: 'ease',
        });
    }

    async dispose() {
        this.#animation?.reverse();
        await this.#animation?.finished;
        this.#animation = undefined;
    }
}
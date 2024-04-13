'use client';

import { MathJax } from 'better-react-mathjax';

// TODO: Stream here the review content
export const MathJaxContent = () => {

    return (
        <div>
            <MathJax>{"\\(a^2 + b^2 = c^2\\)"}</MathJax>
            <h3>Dummy Header</h3>
            <MathJax>
                <div>
                    <h4>Dummy Subheader 1</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit:</p>
                    <span>{"\\(y = mx + b\\)"}</span>
                    <h4>Dummy Subheader 2</h4>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco:</p>
                    <span>{"\\(F = ma\\)"}</span>
                </div>
            </MathJax>
            <p>
                Example text with embedded math <MathJax>{"\\(v = \\frac{d}{t}\\)"}</MathJax> content.
            </p>
            {/* LaTeX-style subheading */}
            <MathJax>{"\\textbf{Subheading in LaTeX Style}"}</MathJax>
            {/* Simulated citation */}
            <MathJax>{"See \\textit{Reference Title}, Author Name, 2023"}</MathJax>
        </div>
    );
 }

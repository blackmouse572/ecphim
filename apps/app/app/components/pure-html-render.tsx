"use client";
import DOMPurify from "dompurify";
import React from "react";

function PureHTMLRender(
  props: { html: string } & React.HTMLAttributes<HTMLDivElement>,
) {
  const clean = DOMPurify.sanitize(props.html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} {...props} />;
}

export default React.memo(PureHTMLRender);

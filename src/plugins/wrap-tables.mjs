import { defineHastPlugin } from 'satteri';

/**
 * Wrap every rendered Markdown table in a scroll container.
 *
 * The table itself can then use `display: table; width: 100%` to fill the
 * article column, while very wide tables overflow into a horizontally
 * scrollable wrapper instead of stretching the page.
 */
const wrapTables = defineHastPlugin({
  name: 'wrap-markdown-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [],
      });
    },
  },
});

export default wrapTables;

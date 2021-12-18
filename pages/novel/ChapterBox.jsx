import { Container, Group, Title, Checkbox } from '@mantine/core';
import Link from 'next/link';

const ChapterBox = ({ chapters }) => {
  return (
    <>
      {chapters?.map((chapter) => (
        <div key={chapter.novSlugChapSlug}>
          <Group
            position="apart"
            sx={{
              div: { paddingBottom: '10px', paddingTop: '10px' },
              position: 'relative',
            }}
            spacing="md"
          >
            <Title>{chapter.title}</Title>
          </Group>
        </div>
      ))}
    </>
  );
};
export default ChapterBox;

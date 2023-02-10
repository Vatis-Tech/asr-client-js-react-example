# Changelog

All notable changes to this project will be documented in this file.

## Guidelines

### Format

To make changes to this file, please keep the following format:

```
## [x.y.z] - yyyy-mm-dd
### Added
-

### Changed
-

### Removed
-

### Fixed
-
```

If there is nothing added please add the following text under that section:

```
No new features were added.
```

If there is nothing changed please add the following text under that section:

```
No changes were made.
```

If there is nothing removed please add the following text under that section:

```
Nothing was removed.
```

If there is nothing fixed please add the following text under that section:

```
No fixes were made.
```

### Insertion

Each time you add new changes to this file, please add them bellow this line - i.e. between the [insertion](#insterion) section and the last version added.

## [2.0.1] - 2022-02-10

### Added

No new features were added.

### Changed

`@vatis-tech/asr-client-js@1.3.0-next.3` to `@vatis-tech/asr-client-js@2.0.1`

### Removed

Nothing was removed.

### Fixed

No fixes were made.

## [1.1.0] - 2022-05-10

### Added

No new features were added.

### Changed

`@vatis-tech/asr-client-js@1.2.2` to `@vatis-tech/asr-client-js@1.3.0-next.3`

```
const VTC_MICROPHONE_TIMESLICE = 250;
const VTC_FRAME_LENGTH = 0.3;
const VTC_FRAME_OVERLAP = 0.3;
const VTC_BUFFER_OFFSET = 0.3;
```

To

```
const VTC_MICROPHONE_TIMESLICE = 500;
const VTC_FRAME_LENGTH = 0.6;
const VTC_FRAME_OVERLAP = 1.0;
const VTC_BUFFER_OFFSET = 0.5;
```

For better accuracy and faster response time.

### Removed

Nothing was removed.

### Fixed

No fixes were made.

## [1.0.0] - 2022-04-28

### Added

- Initial code for How to use Vatis Tech with React

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

No fixes were made.

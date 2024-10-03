// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'timeAgo'
// })
// export class TimeAgoPipe implements PipeTransform {

//   transform(value: string | Date): string {
//     if (!value) return 'Unknown';

//     const now = new Date().getTime();
//     const updatedAt = new Date(value).getTime();
//     const difference = now - updatedAt;

//     const seconds = Math.floor(difference / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 0) {
//       return `${days} day(s) ago`;
//     } else if (hours > 0) {
//       return `${hours} hour(s) ago`;
//     } else if (minutes > 0) {
//       return `${minutes} minute(s) ago`;
//     } else {
//       return `${seconds} second(s) ago`;
//     }
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: true  // Pure pipe, will only recalculate when the input data changes
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return 'Unknown';

    const now = new Date().getTime();
    const updatedAt = new Date(value).getTime();
    const difference = now - updatedAt;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  }
}
